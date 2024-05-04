(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))t(c);new MutationObserver(c=>{for(const y of c)if(y.type==="childList")for(const A of y.addedNodes)A.tagName==="LINK"&&A.rel==="modulepreload"&&t(A)}).observe(document,{childList:!0,subtree:!0});function n(c){const y={};return c.integrity&&(y.integrity=c.integrity),c.referrerPolicy&&(y.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?y.credentials="include":c.crossOrigin==="anonymous"?y.credentials="omit":y.credentials="same-origin",y}function t(c){if(c.ep)return;c.ep=!0;const y=n(c);fetch(c.href,y)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Z_="160",ile={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Wz=0,qV=1,jz=2,lY=1,Yz=2,W6=3,fR=0,S3=1,lp=2,VN=0,Lb=1,KV=2,QV=3,$V=4,zz=5,Z8=100,kz=101,qz=102,ZV=103,JV=104,Kz=200,Qz=201,$z=202,Zz=203,i_=204,o_=205,Jz=206,Xz=207,vz=208,ek=209,tk=210,nk=211,lk=212,sk=213,rk=214,uk=0,ak=1,ik=2,uF=3,ok=4,ck=5,hk=6,fk=7,J_=0,Ik=1,dk=2,WN=0,yk=1,wk=2,Ek=3,Tk=4,pk=5,Rk=6,sY=300,Mb=301,xb=302,c_=303,h_=304,dF=306,f_=1e3,uE=1001,I_=1002,Kf=1003,XV=1004,dG=1005,d2=1006,mk=1007,ZH=1008,jN=1009,Dk=1010,Nk=1011,X_=1012,rY=1013,HN=1014,BN=1015,JH=1016,uY=1017,aY=1018,v8=1020,Ak=1021,aE=1023,Sk=1024,Lk=1025,eL=1026,Hb=1027,Ok=1028,iY=1029,gk=1030,oY=1031,cY=1033,yG=33776,wG=33777,EG=33778,TG=33779,vV=35840,eW=35841,tW=35842,nW=35843,hY=36196,lW=37492,sW=37496,rW=37808,uW=37809,aW=37810,iW=37811,oW=37812,cW=37813,hW=37814,fW=37815,IW=37816,dW=37817,yW=37818,wW=37819,EW=37820,TW=37821,pG=36492,pW=36494,RW=36495,Pk=36283,mW=36284,DW=36285,NW=36286,fY=3e3,tL=3001,bk=3200,Ck=3201,v_=0,Mk=1,y2="",Qf="srgb",tm="srgb-linear",eV="display-p3",yF="display-p3-linear",aF="linear",yr="srgb",iF="rec709",oF="p3",AP=7680,AW=519,xk=512,Hk=513,Bk=514,IY=515,Uk=516,Fk=517,Gk=518,_k=519,d_=35044,ole=35048,SW="300 es",y_=1035,h7=2e3,cF=2001;class $b{addEventListener(l,n){this._listeners===void 0&&(this._listeners={});const t=this._listeners;t[l]===void 0&&(t[l]=[]),t[l].indexOf(n)===-1&&t[l].push(n)}hasEventListener(l,n){if(this._listeners===void 0)return!1;const t=this._listeners;return t[l]!==void 0&&t[l].indexOf(n)!==-1}removeEventListener(l,n){if(this._listeners===void 0)return;const c=this._listeners[l];if(c!==void 0){const y=c.indexOf(n);y!==-1&&c.splice(y,1)}}dispatchEvent(l){if(this._listeners===void 0)return;const t=this._listeners[l.type];if(t!==void 0){l.target=this;const c=t.slice(0);for(let y=0,A=c.length;y<A;y++)c[y].call(this,l);l.target=null}}}const YI=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let LW=1234567;const Ob=Math.PI/180,XH=180/Math.PI;function _7(){const e=Math.random()*4294967295|0,l=Math.random()*4294967295|0,n=Math.random()*4294967295|0,t=Math.random()*4294967295|0;return(YI[e&255]+YI[e>>8&255]+YI[e>>16&255]+YI[e>>24&255]+"-"+YI[l&255]+YI[l>>8&255]+"-"+YI[l>>16&15|64]+YI[l>>24&255]+"-"+YI[n&63|128]+YI[n>>8&255]+"-"+YI[n>>16&255]+YI[n>>24&255]+YI[t&255]+YI[t>>8&255]+YI[t>>16&255]+YI[t>>24&255]).toLowerCase()}function $f(e,l,n){return Math.max(l,Math.min(n,e))}function tV(e,l){return(e%l+l)%l}function Vk(e,l,n,t,c){return t+(e-l)*(c-t)/(n-l)}function Wk(e,l,n){return e!==l?(n-e)/(l-e):0}function YH(e,l,n){return(1-n)*e+n*l}function jk(e,l,n,t){return YH(e,l,1-Math.exp(-n*t))}function Yk(e,l=1){return l-Math.abs(tV(e,l*2)-l)}function zk(e,l,n){return e<=l?0:e>=n?1:(e=(e-l)/(n-l),e*e*(3-2*e))}function kk(e,l,n){return e<=l?0:e>=n?1:(e=(e-l)/(n-l),e*e*e*(e*(e*6-15)+10))}function qk(e,l){return e+Math.floor(Math.random()*(l-e+1))}function Kk(e,l){return e+Math.random()*(l-e)}function Qk(e){return e*(.5-Math.random())}function $k(e){e!==void 0&&(LW=e);let l=LW+=1831565813;return l=Math.imul(l^l>>>15,l|1),l^=l+Math.imul(l^l>>>7,l|61),((l^l>>>14)>>>0)/4294967296}function Zk(e){return e*Ob}function Jk(e){return e*XH}function w_(e){return(e&e-1)===0&&e!==0}function Xk(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.LN2))}function hF(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))}function vk(e,l,n,t,c){const y=Math.cos,A=Math.sin,g=y(n/2),U=A(n/2),_=y((l+t)/2),Q=A((l+t)/2),ee=y((l-t)/2),J=A((l-t)/2),te=y((t-l)/2),he=A((t-l)/2);switch(c){case"XYX":e.set(g*Q,U*ee,U*J,g*_);break;case"YZY":e.set(U*J,g*Q,U*ee,g*_);break;case"ZXZ":e.set(U*ee,U*J,g*Q,g*_);break;case"XZX":e.set(g*Q,U*he,U*te,g*_);break;case"YXY":e.set(U*te,g*Q,U*he,g*_);break;case"ZYZ":e.set(U*he,U*te,g*Q,g*_);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+c)}}function sp(e,l){switch(l.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("Invalid component type.")}}function ks(e,l){switch(l.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("Invalid component type.")}}const cle={DEG2RAD:Ob,RAD2DEG:XH,generateUUID:_7,clamp:$f,euclideanModulo:tV,mapLinear:Vk,inverseLerp:Wk,lerp:YH,damp:jk,pingpong:Yk,smoothstep:zk,smootherstep:kk,randInt:qk,randFloat:Kk,randFloatSpread:Qk,seededRandom:$k,degToRad:Zk,radToDeg:Jk,isPowerOfTwo:w_,ceilPowerOfTwo:Xk,floorPowerOfTwo:hF,setQuaternionFromProperEuler:vk,normalize:ks,denormalize:sp};class Nl{constructor(l=0,n=0){Nl.prototype.isVector2=!0,this.x=l,this.y=n}get width(){return this.x}set width(l){this.x=l}get height(){return this.y}set height(l){this.y=l}set(l,n){return this.x=l,this.y=n,this}setScalar(l){return this.x=l,this.y=l,this}setX(l){return this.x=l,this}setY(l){return this.y=l,this}setComponent(l,n){switch(l){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+l)}return this}getComponent(l){switch(l){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+l)}}clone(){return new this.constructor(this.x,this.y)}copy(l){return this.x=l.x,this.y=l.y,this}add(l){return this.x+=l.x,this.y+=l.y,this}addScalar(l){return this.x+=l,this.y+=l,this}addVectors(l,n){return this.x=l.x+n.x,this.y=l.y+n.y,this}addScaledVector(l,n){return this.x+=l.x*n,this.y+=l.y*n,this}sub(l){return this.x-=l.x,this.y-=l.y,this}subScalar(l){return this.x-=l,this.y-=l,this}subVectors(l,n){return this.x=l.x-n.x,this.y=l.y-n.y,this}multiply(l){return this.x*=l.x,this.y*=l.y,this}multiplyScalar(l){return this.x*=l,this.y*=l,this}divide(l){return this.x/=l.x,this.y/=l.y,this}divideScalar(l){return this.multiplyScalar(1/l)}applyMatrix3(l){const n=this.x,t=this.y,c=l.elements;return this.x=c[0]*n+c[3]*t+c[6],this.y=c[1]*n+c[4]*t+c[7],this}min(l){return this.x=Math.min(this.x,l.x),this.y=Math.min(this.y,l.y),this}max(l){return this.x=Math.max(this.x,l.x),this.y=Math.max(this.y,l.y),this}clamp(l,n){return this.x=Math.max(l.x,Math.min(n.x,this.x)),this.y=Math.max(l.y,Math.min(n.y,this.y)),this}clampScalar(l,n){return this.x=Math.max(l,Math.min(n,this.x)),this.y=Math.max(l,Math.min(n,this.y)),this}clampLength(l,n){const t=this.length();return this.divideScalar(t||1).multiplyScalar(Math.max(l,Math.min(n,t)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(l){return this.x*l.x+this.y*l.y}cross(l){return this.x*l.y-this.y*l.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(l){const n=Math.sqrt(this.lengthSq()*l.lengthSq());if(n===0)return Math.PI/2;const t=this.dot(l)/n;return Math.acos($f(t,-1,1))}distanceTo(l){return Math.sqrt(this.distanceToSquared(l))}distanceToSquared(l){const n=this.x-l.x,t=this.y-l.y;return n*n+t*t}manhattanDistanceTo(l){return Math.abs(this.x-l.x)+Math.abs(this.y-l.y)}setLength(l){return this.normalize().multiplyScalar(l)}lerp(l,n){return this.x+=(l.x-this.x)*n,this.y+=(l.y-this.y)*n,this}lerpVectors(l,n,t){return this.x=l.x+(n.x-l.x)*t,this.y=l.y+(n.y-l.y)*t,this}equals(l){return l.x===this.x&&l.y===this.y}fromArray(l,n=0){return this.x=l[n],this.y=l[n+1],this}toArray(l=[],n=0){return l[n]=this.x,l[n+1]=this.y,l}fromBufferAttribute(l,n){return this.x=l.getX(n),this.y=l.getY(n),this}rotateAround(l,n){const t=Math.cos(n),c=Math.sin(n),y=this.x-l.x,A=this.y-l.y;return this.x=y*t-A*c+l.x,this.y=y*c+A*t+l.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class jl{constructor(l,n,t,c,y,A,g,U,_){jl.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],l!==void 0&&this.set(l,n,t,c,y,A,g,U,_)}set(l,n,t,c,y,A,g,U,_){const Q=this.elements;return Q[0]=l,Q[1]=c,Q[2]=g,Q[3]=n,Q[4]=y,Q[5]=U,Q[6]=t,Q[7]=A,Q[8]=_,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(l){const n=this.elements,t=l.elements;return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],this}extractBasis(l,n,t){return l.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),t.setFromMatrix3Column(this,2),this}setFromMatrix4(l){const n=l.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(l){return this.multiplyMatrices(this,l)}premultiply(l){return this.multiplyMatrices(l,this)}multiplyMatrices(l,n){const t=l.elements,c=n.elements,y=this.elements,A=t[0],g=t[3],U=t[6],_=t[1],Q=t[4],ee=t[7],J=t[2],te=t[5],he=t[8],de=c[0],oe=c[3],ie=c[6],Re=c[1],Ie=c[4],Ne=c[7],je=c[2],Be=c[5],Fe=c[8];return y[0]=A*de+g*Re+U*je,y[3]=A*oe+g*Ie+U*Be,y[6]=A*ie+g*Ne+U*Fe,y[1]=_*de+Q*Re+ee*je,y[4]=_*oe+Q*Ie+ee*Be,y[7]=_*ie+Q*Ne+ee*Fe,y[2]=J*de+te*Re+he*je,y[5]=J*oe+te*Ie+he*Be,y[8]=J*ie+te*Ne+he*Fe,this}multiplyScalar(l){const n=this.elements;return n[0]*=l,n[3]*=l,n[6]*=l,n[1]*=l,n[4]*=l,n[7]*=l,n[2]*=l,n[5]*=l,n[8]*=l,this}determinant(){const l=this.elements,n=l[0],t=l[1],c=l[2],y=l[3],A=l[4],g=l[5],U=l[6],_=l[7],Q=l[8];return n*A*Q-n*g*_-t*y*Q+t*g*U+c*y*_-c*A*U}invert(){const l=this.elements,n=l[0],t=l[1],c=l[2],y=l[3],A=l[4],g=l[5],U=l[6],_=l[7],Q=l[8],ee=Q*A-g*_,J=g*U-Q*y,te=_*y-A*U,he=n*ee+t*J+c*te;if(he===0)return this.set(0,0,0,0,0,0,0,0,0);const de=1/he;return l[0]=ee*de,l[1]=(c*_-Q*t)*de,l[2]=(g*t-c*A)*de,l[3]=J*de,l[4]=(Q*n-c*U)*de,l[5]=(c*y-g*n)*de,l[6]=te*de,l[7]=(t*U-_*n)*de,l[8]=(A*n-t*y)*de,this}transpose(){let l;const n=this.elements;return l=n[1],n[1]=n[3],n[3]=l,l=n[2],n[2]=n[6],n[6]=l,l=n[5],n[5]=n[7],n[7]=l,this}getNormalMatrix(l){return this.setFromMatrix4(l).invert().transpose()}transposeIntoArray(l){const n=this.elements;return l[0]=n[0],l[1]=n[3],l[2]=n[6],l[3]=n[1],l[4]=n[4],l[5]=n[7],l[6]=n[2],l[7]=n[5],l[8]=n[8],this}setUvTransform(l,n,t,c,y,A,g){const U=Math.cos(y),_=Math.sin(y);return this.set(t*U,t*_,-t*(U*A+_*g)+A+l,-c*_,c*U,-c*(-_*A+U*g)+g+n,0,0,1),this}scale(l,n){return this.premultiply(RG.makeScale(l,n)),this}rotate(l){return this.premultiply(RG.makeRotation(-l)),this}translate(l,n){return this.premultiply(RG.makeTranslation(l,n)),this}makeTranslation(l,n){return l.isVector2?this.set(1,0,l.x,0,1,l.y,0,0,1):this.set(1,0,l,0,1,n,0,0,1),this}makeRotation(l){const n=Math.cos(l),t=Math.sin(l);return this.set(n,-t,0,t,n,0,0,0,1),this}makeScale(l,n){return this.set(l,0,0,0,n,0,0,0,1),this}equals(l){const n=this.elements,t=l.elements;for(let c=0;c<9;c++)if(n[c]!==t[c])return!1;return!0}fromArray(l,n=0){for(let t=0;t<9;t++)this.elements[t]=l[t+n];return this}toArray(l=[],n=0){const t=this.elements;return l[n]=t[0],l[n+1]=t[1],l[n+2]=t[2],l[n+3]=t[3],l[n+4]=t[4],l[n+5]=t[5],l[n+6]=t[6],l[n+7]=t[7],l[n+8]=t[8],l}clone(){return new this.constructor().fromArray(this.elements)}}const RG=new jl;function dY(e){for(let l=e.length-1;l>=0;--l)if(e[l]>=65535)return!0;return!1}function fF(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function eq(){const e=fF("canvas");return e.style.display="block",e}const OW={};function zH(e){e in OW||(OW[e]=!0,console.warn(e))}const gW=new jl().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),PW=new jl().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),xB={[tm]:{transfer:aF,primaries:iF,toReference:e=>e,fromReference:e=>e},[Qf]:{transfer:yr,primaries:iF,toReference:e=>e.convertSRGBToLinear(),fromReference:e=>e.convertLinearToSRGB()},[yF]:{transfer:aF,primaries:oF,toReference:e=>e.applyMatrix3(PW),fromReference:e=>e.applyMatrix3(gW)},[eV]:{transfer:yr,primaries:oF,toReference:e=>e.convertSRGBToLinear().applyMatrix3(PW),fromReference:e=>e.applyMatrix3(gW).convertLinearToSRGB()}},tq=new Set([tm,yF]),qs={enabled:!0,_workingColorSpace:tm,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(e){if(!tq.has(e))throw new Error(`Unsupported working color space, "${e}".`);this._workingColorSpace=e},convert:function(e,l,n){if(this.enabled===!1||l===n||!l||!n)return e;const t=xB[l].toReference,c=xB[n].fromReference;return c(t(e))},fromWorkingColorSpace:function(e,l){return this.convert(e,this._workingColorSpace,l)},toWorkingColorSpace:function(e,l){return this.convert(e,l,this._workingColorSpace)},getPrimaries:function(e){return xB[e].primaries},getTransfer:function(e){return e===y2?aF:xB[e].transfer}};function gb(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function mG(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}let SP;class yY{static getDataURL(l){if(/^data:/i.test(l.src)||typeof HTMLCanvasElement>"u")return l.src;let n;if(l instanceof HTMLCanvasElement)n=l;else{SP===void 0&&(SP=fF("canvas")),SP.width=l.width,SP.height=l.height;const t=SP.getContext("2d");l instanceof ImageData?t.putImageData(l,0,0):t.drawImage(l,0,0,l.width,l.height),n=SP}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",l),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(l){if(typeof HTMLImageElement<"u"&&l instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&l instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&l instanceof ImageBitmap){const n=fF("canvas");n.width=l.width,n.height=l.height;const t=n.getContext("2d");t.drawImage(l,0,0,l.width,l.height);const c=t.getImageData(0,0,l.width,l.height),y=c.data;for(let A=0;A<y.length;A++)y[A]=gb(y[A]/255)*255;return t.putImageData(c,0,0),n}else if(l.data){const n=l.data.slice(0);for(let t=0;t<n.length;t++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[t]=Math.floor(gb(n[t]/255)*255):n[t]=gb(n[t]);return{data:n,width:l.width,height:l.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),l}}let nq=0;class wY{constructor(l=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nq++}),this.uuid=_7(),this.data=l,this.version=0}set needsUpdate(l){l===!0&&this.version++}toJSON(l){const n=l===void 0||typeof l=="string";if(!n&&l.images[this.uuid]!==void 0)return l.images[this.uuid];const t={uuid:this.uuid,url:""},c=this.data;if(c!==null){let y;if(Array.isArray(c)){y=[];for(let A=0,g=c.length;A<g;A++)c[A].isDataTexture?y.push(DG(c[A].image)):y.push(DG(c[A]))}else y=DG(c);t.url=y}return n||(l.images[this.uuid]=t),t}}function DG(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?yY.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let lq=0;class D0 extends $b{constructor(l=D0.DEFAULT_IMAGE,n=D0.DEFAULT_MAPPING,t=uE,c=uE,y=d2,A=ZH,g=aE,U=jN,_=D0.DEFAULT_ANISOTROPY,Q=y2){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lq++}),this.uuid=_7(),this.name="",this.source=new wY(l),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=t,this.wrapT=c,this.magFilter=y,this.minFilter=A,this.anisotropy=_,this.format=g,this.internalFormat=null,this.type=U,this.offset=new Nl(0,0),this.repeat=new Nl(1,1),this.center=new Nl(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jl,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof Q=="string"?this.colorSpace=Q:(zH("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=Q===tL?Qf:y2),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(l=null){this.source.data=l}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(l){return this.name=l.name,this.source=l.source,this.mipmaps=l.mipmaps.slice(0),this.mapping=l.mapping,this.channel=l.channel,this.wrapS=l.wrapS,this.wrapT=l.wrapT,this.magFilter=l.magFilter,this.minFilter=l.minFilter,this.anisotropy=l.anisotropy,this.format=l.format,this.internalFormat=l.internalFormat,this.type=l.type,this.offset.copy(l.offset),this.repeat.copy(l.repeat),this.center.copy(l.center),this.rotation=l.rotation,this.matrixAutoUpdate=l.matrixAutoUpdate,this.matrix.copy(l.matrix),this.generateMipmaps=l.generateMipmaps,this.premultiplyAlpha=l.premultiplyAlpha,this.flipY=l.flipY,this.unpackAlignment=l.unpackAlignment,this.colorSpace=l.colorSpace,this.userData=JSON.parse(JSON.stringify(l.userData)),this.needsUpdate=!0,this}toJSON(l){const n=l===void 0||typeof l=="string";if(!n&&l.textures[this.uuid]!==void 0)return l.textures[this.uuid];const t={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(l).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(t.userData=this.userData),n||(l.textures[this.uuid]=t),t}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(l){if(this.mapping!==sY)return l;if(l.applyMatrix3(this.matrix),l.x<0||l.x>1)switch(this.wrapS){case f_:l.x=l.x-Math.floor(l.x);break;case uE:l.x=l.x<0?0:1;break;case I_:Math.abs(Math.floor(l.x)%2)===1?l.x=Math.ceil(l.x)-l.x:l.x=l.x-Math.floor(l.x);break}if(l.y<0||l.y>1)switch(this.wrapT){case f_:l.y=l.y-Math.floor(l.y);break;case uE:l.y=l.y<0?0:1;break;case I_:Math.abs(Math.floor(l.y)%2)===1?l.y=Math.ceil(l.y)-l.y:l.y=l.y-Math.floor(l.y);break}return this.flipY&&(l.y=1-l.y),l}set needsUpdate(l){l===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return zH("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Qf?tL:fY}set encoding(l){zH("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=l===tL?Qf:y2}}D0.DEFAULT_IMAGE=null;D0.DEFAULT_MAPPING=sY;D0.DEFAULT_ANISOTROPY=1;class Gc{constructor(l=0,n=0,t=0,c=1){Gc.prototype.isVector4=!0,this.x=l,this.y=n,this.z=t,this.w=c}get width(){return this.z}set width(l){this.z=l}get height(){return this.w}set height(l){this.w=l}set(l,n,t,c){return this.x=l,this.y=n,this.z=t,this.w=c,this}setScalar(l){return this.x=l,this.y=l,this.z=l,this.w=l,this}setX(l){return this.x=l,this}setY(l){return this.y=l,this}setZ(l){return this.z=l,this}setW(l){return this.w=l,this}setComponent(l,n){switch(l){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+l)}return this}getComponent(l){switch(l){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+l)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(l){return this.x=l.x,this.y=l.y,this.z=l.z,this.w=l.w!==void 0?l.w:1,this}add(l){return this.x+=l.x,this.y+=l.y,this.z+=l.z,this.w+=l.w,this}addScalar(l){return this.x+=l,this.y+=l,this.z+=l,this.w+=l,this}addVectors(l,n){return this.x=l.x+n.x,this.y=l.y+n.y,this.z=l.z+n.z,this.w=l.w+n.w,this}addScaledVector(l,n){return this.x+=l.x*n,this.y+=l.y*n,this.z+=l.z*n,this.w+=l.w*n,this}sub(l){return this.x-=l.x,this.y-=l.y,this.z-=l.z,this.w-=l.w,this}subScalar(l){return this.x-=l,this.y-=l,this.z-=l,this.w-=l,this}subVectors(l,n){return this.x=l.x-n.x,this.y=l.y-n.y,this.z=l.z-n.z,this.w=l.w-n.w,this}multiply(l){return this.x*=l.x,this.y*=l.y,this.z*=l.z,this.w*=l.w,this}multiplyScalar(l){return this.x*=l,this.y*=l,this.z*=l,this.w*=l,this}applyMatrix4(l){const n=this.x,t=this.y,c=this.z,y=this.w,A=l.elements;return this.x=A[0]*n+A[4]*t+A[8]*c+A[12]*y,this.y=A[1]*n+A[5]*t+A[9]*c+A[13]*y,this.z=A[2]*n+A[6]*t+A[10]*c+A[14]*y,this.w=A[3]*n+A[7]*t+A[11]*c+A[15]*y,this}divideScalar(l){return this.multiplyScalar(1/l)}setAxisAngleFromQuaternion(l){this.w=2*Math.acos(l.w);const n=Math.sqrt(1-l.w*l.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=l.x/n,this.y=l.y/n,this.z=l.z/n),this}setAxisAngleFromRotationMatrix(l){let n,t,c,y;const U=l.elements,_=U[0],Q=U[4],ee=U[8],J=U[1],te=U[5],he=U[9],de=U[2],oe=U[6],ie=U[10];if(Math.abs(Q-J)<.01&&Math.abs(ee-de)<.01&&Math.abs(he-oe)<.01){if(Math.abs(Q+J)<.1&&Math.abs(ee+de)<.1&&Math.abs(he+oe)<.1&&Math.abs(_+te+ie-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const Ie=(_+1)/2,Ne=(te+1)/2,je=(ie+1)/2,Be=(Q+J)/4,Fe=(ee+de)/4,Je=(he+oe)/4;return Ie>Ne&&Ie>je?Ie<.01?(t=0,c=.707106781,y=.707106781):(t=Math.sqrt(Ie),c=Be/t,y=Fe/t):Ne>je?Ne<.01?(t=.707106781,c=0,y=.707106781):(c=Math.sqrt(Ne),t=Be/c,y=Je/c):je<.01?(t=.707106781,c=.707106781,y=0):(y=Math.sqrt(je),t=Fe/y,c=Je/y),this.set(t,c,y,n),this}let Re=Math.sqrt((oe-he)*(oe-he)+(ee-de)*(ee-de)+(J-Q)*(J-Q));return Math.abs(Re)<.001&&(Re=1),this.x=(oe-he)/Re,this.y=(ee-de)/Re,this.z=(J-Q)/Re,this.w=Math.acos((_+te+ie-1)/2),this}min(l){return this.x=Math.min(this.x,l.x),this.y=Math.min(this.y,l.y),this.z=Math.min(this.z,l.z),this.w=Math.min(this.w,l.w),this}max(l){return this.x=Math.max(this.x,l.x),this.y=Math.max(this.y,l.y),this.z=Math.max(this.z,l.z),this.w=Math.max(this.w,l.w),this}clamp(l,n){return this.x=Math.max(l.x,Math.min(n.x,this.x)),this.y=Math.max(l.y,Math.min(n.y,this.y)),this.z=Math.max(l.z,Math.min(n.z,this.z)),this.w=Math.max(l.w,Math.min(n.w,this.w)),this}clampScalar(l,n){return this.x=Math.max(l,Math.min(n,this.x)),this.y=Math.max(l,Math.min(n,this.y)),this.z=Math.max(l,Math.min(n,this.z)),this.w=Math.max(l,Math.min(n,this.w)),this}clampLength(l,n){const t=this.length();return this.divideScalar(t||1).multiplyScalar(Math.max(l,Math.min(n,t)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(l){return this.x*l.x+this.y*l.y+this.z*l.z+this.w*l.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(l){return this.normalize().multiplyScalar(l)}lerp(l,n){return this.x+=(l.x-this.x)*n,this.y+=(l.y-this.y)*n,this.z+=(l.z-this.z)*n,this.w+=(l.w-this.w)*n,this}lerpVectors(l,n,t){return this.x=l.x+(n.x-l.x)*t,this.y=l.y+(n.y-l.y)*t,this.z=l.z+(n.z-l.z)*t,this.w=l.w+(n.w-l.w)*t,this}equals(l){return l.x===this.x&&l.y===this.y&&l.z===this.z&&l.w===this.w}fromArray(l,n=0){return this.x=l[n],this.y=l[n+1],this.z=l[n+2],this.w=l[n+3],this}toArray(l=[],n=0){return l[n]=this.x,l[n+1]=this.y,l[n+2]=this.z,l[n+3]=this.w,l}fromBufferAttribute(l,n){return this.x=l.getX(n),this.y=l.getY(n),this.z=l.getZ(n),this.w=l.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class sq extends $b{constructor(l=1,n=1,t={}){super(),this.isRenderTarget=!0,this.width=l,this.height=n,this.depth=1,this.scissor=new Gc(0,0,l,n),this.scissorTest=!1,this.viewport=new Gc(0,0,l,n);const c={width:l,height:n,depth:1};t.encoding!==void 0&&(zH("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===tL?Qf:y2),t=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:d2,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},t),this.texture=new D0(c,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=t.generateMipmaps,this.texture.internalFormat=t.internalFormat,this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.depthTexture=t.depthTexture,this.samples=t.samples}setSize(l,n,t=1){(this.width!==l||this.height!==n||this.depth!==t)&&(this.width=l,this.height=n,this.depth=t,this.texture.image.width=l,this.texture.image.height=n,this.texture.image.depth=t,this.dispose()),this.viewport.set(0,0,l,n),this.scissor.set(0,0,l,n)}clone(){return new this.constructor().copy(this)}copy(l){this.width=l.width,this.height=l.height,this.depth=l.depth,this.scissor.copy(l.scissor),this.scissorTest=l.scissorTest,this.viewport.copy(l.viewport),this.texture=l.texture.clone(),this.texture.isRenderTargetTexture=!0;const n=Object.assign({},l.texture.image);return this.texture.source=new wY(n),this.depthBuffer=l.depthBuffer,this.stencilBuffer=l.stencilBuffer,l.depthTexture!==null&&(this.depthTexture=l.depthTexture.clone()),this.samples=l.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kN extends sq{constructor(l=1,n=1,t={}){super(l,n,t),this.isWebGLRenderTarget=!0}}class EY extends D0{constructor(l=null,n=1,t=1,c=1){super(null),this.isDataArrayTexture=!0,this.image={data:l,width:n,height:t,depth:c},this.magFilter=Kf,this.minFilter=Kf,this.wrapR=uE,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class rq extends D0{constructor(l=null,n=1,t=1,c=1){super(null),this.isData3DTexture=!0,this.image={data:l,width:n,height:t,depth:c},this.magFilter=Kf,this.minFilter=Kf,this.wrapR=uE,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hle extends kN{constructor(l=1,n=1,t=1,c={}){super(l,n,c),this.isWebGLMultipleRenderTargets=!0;const y=this.texture;this.texture=[];for(let A=0;A<t;A++)this.texture[A]=y.clone(),this.texture[A].isRenderTargetTexture=!0}setSize(l,n,t=1){if(this.width!==l||this.height!==n||this.depth!==t){this.width=l,this.height=n,this.depth=t;for(let c=0,y=this.texture.length;c<y;c++)this.texture[c].image.width=l,this.texture[c].image.height=n,this.texture[c].image.depth=t;this.dispose()}this.viewport.set(0,0,l,n),this.scissor.set(0,0,l,n)}copy(l){this.dispose(),this.width=l.width,this.height=l.height,this.depth=l.depth,this.scissor.copy(l.scissor),this.scissorTest=l.scissorTest,this.viewport.copy(l.viewport),this.depthBuffer=l.depthBuffer,this.stencilBuffer=l.stencilBuffer,l.depthTexture!==null&&(this.depthTexture=l.depthTexture.clone()),this.texture.length=0;for(let n=0,t=l.texture.length;n<t;n++)this.texture[n]=l.texture[n].clone(),this.texture[n].isRenderTargetTexture=!0;return this}}class TB{constructor(l=0,n=0,t=0,c=1){this.isQuaternion=!0,this._x=l,this._y=n,this._z=t,this._w=c}static slerpFlat(l,n,t,c,y,A,g){let U=t[c+0],_=t[c+1],Q=t[c+2],ee=t[c+3];const J=y[A+0],te=y[A+1],he=y[A+2],de=y[A+3];if(g===0){l[n+0]=U,l[n+1]=_,l[n+2]=Q,l[n+3]=ee;return}if(g===1){l[n+0]=J,l[n+1]=te,l[n+2]=he,l[n+3]=de;return}if(ee!==de||U!==J||_!==te||Q!==he){let oe=1-g;const ie=U*J+_*te+Q*he+ee*de,Re=ie>=0?1:-1,Ie=1-ie*ie;if(Ie>Number.EPSILON){const je=Math.sqrt(Ie),Be=Math.atan2(je,ie*Re);oe=Math.sin(oe*Be)/je,g=Math.sin(g*Be)/je}const Ne=g*Re;if(U=U*oe+J*Ne,_=_*oe+te*Ne,Q=Q*oe+he*Ne,ee=ee*oe+de*Ne,oe===1-g){const je=1/Math.sqrt(U*U+_*_+Q*Q+ee*ee);U*=je,_*=je,Q*=je,ee*=je}}l[n]=U,l[n+1]=_,l[n+2]=Q,l[n+3]=ee}static multiplyQuaternionsFlat(l,n,t,c,y,A){const g=t[c],U=t[c+1],_=t[c+2],Q=t[c+3],ee=y[A],J=y[A+1],te=y[A+2],he=y[A+3];return l[n]=g*he+Q*ee+U*te-_*J,l[n+1]=U*he+Q*J+_*ee-g*te,l[n+2]=_*he+Q*te+g*J-U*ee,l[n+3]=Q*he-g*ee-U*J-_*te,l}get x(){return this._x}set x(l){this._x=l,this._onChangeCallback()}get y(){return this._y}set y(l){this._y=l,this._onChangeCallback()}get z(){return this._z}set z(l){this._z=l,this._onChangeCallback()}get w(){return this._w}set w(l){this._w=l,this._onChangeCallback()}set(l,n,t,c){return this._x=l,this._y=n,this._z=t,this._w=c,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(l){return this._x=l.x,this._y=l.y,this._z=l.z,this._w=l.w,this._onChangeCallback(),this}setFromEuler(l,n=!0){const t=l._x,c=l._y,y=l._z,A=l._order,g=Math.cos,U=Math.sin,_=g(t/2),Q=g(c/2),ee=g(y/2),J=U(t/2),te=U(c/2),he=U(y/2);switch(A){case"XYZ":this._x=J*Q*ee+_*te*he,this._y=_*te*ee-J*Q*he,this._z=_*Q*he+J*te*ee,this._w=_*Q*ee-J*te*he;break;case"YXZ":this._x=J*Q*ee+_*te*he,this._y=_*te*ee-J*Q*he,this._z=_*Q*he-J*te*ee,this._w=_*Q*ee+J*te*he;break;case"ZXY":this._x=J*Q*ee-_*te*he,this._y=_*te*ee+J*Q*he,this._z=_*Q*he+J*te*ee,this._w=_*Q*ee-J*te*he;break;case"ZYX":this._x=J*Q*ee-_*te*he,this._y=_*te*ee+J*Q*he,this._z=_*Q*he-J*te*ee,this._w=_*Q*ee+J*te*he;break;case"YZX":this._x=J*Q*ee+_*te*he,this._y=_*te*ee+J*Q*he,this._z=_*Q*he-J*te*ee,this._w=_*Q*ee-J*te*he;break;case"XZY":this._x=J*Q*ee-_*te*he,this._y=_*te*ee-J*Q*he,this._z=_*Q*he+J*te*ee,this._w=_*Q*ee+J*te*he;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+A)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(l,n){const t=n/2,c=Math.sin(t);return this._x=l.x*c,this._y=l.y*c,this._z=l.z*c,this._w=Math.cos(t),this._onChangeCallback(),this}setFromRotationMatrix(l){const n=l.elements,t=n[0],c=n[4],y=n[8],A=n[1],g=n[5],U=n[9],_=n[2],Q=n[6],ee=n[10],J=t+g+ee;if(J>0){const te=.5/Math.sqrt(J+1);this._w=.25/te,this._x=(Q-U)*te,this._y=(y-_)*te,this._z=(A-c)*te}else if(t>g&&t>ee){const te=2*Math.sqrt(1+t-g-ee);this._w=(Q-U)/te,this._x=.25*te,this._y=(c+A)/te,this._z=(y+_)/te}else if(g>ee){const te=2*Math.sqrt(1+g-t-ee);this._w=(y-_)/te,this._x=(c+A)/te,this._y=.25*te,this._z=(U+Q)/te}else{const te=2*Math.sqrt(1+ee-t-g);this._w=(A-c)/te,this._x=(y+_)/te,this._y=(U+Q)/te,this._z=.25*te}return this._onChangeCallback(),this}setFromUnitVectors(l,n){let t=l.dot(n)+1;return t<Number.EPSILON?(t=0,Math.abs(l.x)>Math.abs(l.z)?(this._x=-l.y,this._y=l.x,this._z=0,this._w=t):(this._x=0,this._y=-l.z,this._z=l.y,this._w=t)):(this._x=l.y*n.z-l.z*n.y,this._y=l.z*n.x-l.x*n.z,this._z=l.x*n.y-l.y*n.x,this._w=t),this.normalize()}angleTo(l){return 2*Math.acos(Math.abs($f(this.dot(l),-1,1)))}rotateTowards(l,n){const t=this.angleTo(l);if(t===0)return this;const c=Math.min(1,n/t);return this.slerp(l,c),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(l){return this._x*l._x+this._y*l._y+this._z*l._z+this._w*l._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let l=this.length();return l===0?(this._x=0,this._y=0,this._z=0,this._w=1):(l=1/l,this._x=this._x*l,this._y=this._y*l,this._z=this._z*l,this._w=this._w*l),this._onChangeCallback(),this}multiply(l){return this.multiplyQuaternions(this,l)}premultiply(l){return this.multiplyQuaternions(l,this)}multiplyQuaternions(l,n){const t=l._x,c=l._y,y=l._z,A=l._w,g=n._x,U=n._y,_=n._z,Q=n._w;return this._x=t*Q+A*g+c*_-y*U,this._y=c*Q+A*U+y*g-t*_,this._z=y*Q+A*_+t*U-c*g,this._w=A*Q-t*g-c*U-y*_,this._onChangeCallback(),this}slerp(l,n){if(n===0)return this;if(n===1)return this.copy(l);const t=this._x,c=this._y,y=this._z,A=this._w;let g=A*l._w+t*l._x+c*l._y+y*l._z;if(g<0?(this._w=-l._w,this._x=-l._x,this._y=-l._y,this._z=-l._z,g=-g):this.copy(l),g>=1)return this._w=A,this._x=t,this._y=c,this._z=y,this;const U=1-g*g;if(U<=Number.EPSILON){const te=1-n;return this._w=te*A+n*this._w,this._x=te*t+n*this._x,this._y=te*c+n*this._y,this._z=te*y+n*this._z,this.normalize(),this}const _=Math.sqrt(U),Q=Math.atan2(_,g),ee=Math.sin((1-n)*Q)/_,J=Math.sin(n*Q)/_;return this._w=A*ee+this._w*J,this._x=t*ee+this._x*J,this._y=c*ee+this._y*J,this._z=y*ee+this._z*J,this._onChangeCallback(),this}slerpQuaternions(l,n,t){return this.copy(l).slerp(n,t)}random(){const l=Math.random(),n=Math.sqrt(1-l),t=Math.sqrt(l),c=2*Math.PI*Math.random(),y=2*Math.PI*Math.random();return this.set(n*Math.cos(c),t*Math.sin(y),t*Math.cos(y),n*Math.sin(c))}equals(l){return l._x===this._x&&l._y===this._y&&l._z===this._z&&l._w===this._w}fromArray(l,n=0){return this._x=l[n],this._y=l[n+1],this._z=l[n+2],this._w=l[n+3],this._onChangeCallback(),this}toArray(l=[],n=0){return l[n]=this._x,l[n+1]=this._y,l[n+2]=this._z,l[n+3]=this._w,l}fromBufferAttribute(l,n){return this._x=l.getX(n),this._y=l.getY(n),this._z=l.getZ(n),this._w=l.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(l){return this._onChangeCallback=l,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class nt{constructor(l=0,n=0,t=0){nt.prototype.isVector3=!0,this.x=l,this.y=n,this.z=t}set(l,n,t){return t===void 0&&(t=this.z),this.x=l,this.y=n,this.z=t,this}setScalar(l){return this.x=l,this.y=l,this.z=l,this}setX(l){return this.x=l,this}setY(l){return this.y=l,this}setZ(l){return this.z=l,this}setComponent(l,n){switch(l){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+l)}return this}getComponent(l){switch(l){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+l)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(l){return this.x=l.x,this.y=l.y,this.z=l.z,this}add(l){return this.x+=l.x,this.y+=l.y,this.z+=l.z,this}addScalar(l){return this.x+=l,this.y+=l,this.z+=l,this}addVectors(l,n){return this.x=l.x+n.x,this.y=l.y+n.y,this.z=l.z+n.z,this}addScaledVector(l,n){return this.x+=l.x*n,this.y+=l.y*n,this.z+=l.z*n,this}sub(l){return this.x-=l.x,this.y-=l.y,this.z-=l.z,this}subScalar(l){return this.x-=l,this.y-=l,this.z-=l,this}subVectors(l,n){return this.x=l.x-n.x,this.y=l.y-n.y,this.z=l.z-n.z,this}multiply(l){return this.x*=l.x,this.y*=l.y,this.z*=l.z,this}multiplyScalar(l){return this.x*=l,this.y*=l,this.z*=l,this}multiplyVectors(l,n){return this.x=l.x*n.x,this.y=l.y*n.y,this.z=l.z*n.z,this}applyEuler(l){return this.applyQuaternion(bW.setFromEuler(l))}applyAxisAngle(l,n){return this.applyQuaternion(bW.setFromAxisAngle(l,n))}applyMatrix3(l){const n=this.x,t=this.y,c=this.z,y=l.elements;return this.x=y[0]*n+y[3]*t+y[6]*c,this.y=y[1]*n+y[4]*t+y[7]*c,this.z=y[2]*n+y[5]*t+y[8]*c,this}applyNormalMatrix(l){return this.applyMatrix3(l).normalize()}applyMatrix4(l){const n=this.x,t=this.y,c=this.z,y=l.elements,A=1/(y[3]*n+y[7]*t+y[11]*c+y[15]);return this.x=(y[0]*n+y[4]*t+y[8]*c+y[12])*A,this.y=(y[1]*n+y[5]*t+y[9]*c+y[13])*A,this.z=(y[2]*n+y[6]*t+y[10]*c+y[14])*A,this}applyQuaternion(l){const n=this.x,t=this.y,c=this.z,y=l.x,A=l.y,g=l.z,U=l.w,_=2*(A*c-g*t),Q=2*(g*n-y*c),ee=2*(y*t-A*n);return this.x=n+U*_+A*ee-g*Q,this.y=t+U*Q+g*_-y*ee,this.z=c+U*ee+y*Q-A*_,this}project(l){return this.applyMatrix4(l.matrixWorldInverse).applyMatrix4(l.projectionMatrix)}unproject(l){return this.applyMatrix4(l.projectionMatrixInverse).applyMatrix4(l.matrixWorld)}transformDirection(l){const n=this.x,t=this.y,c=this.z,y=l.elements;return this.x=y[0]*n+y[4]*t+y[8]*c,this.y=y[1]*n+y[5]*t+y[9]*c,this.z=y[2]*n+y[6]*t+y[10]*c,this.normalize()}divide(l){return this.x/=l.x,this.y/=l.y,this.z/=l.z,this}divideScalar(l){return this.multiplyScalar(1/l)}min(l){return this.x=Math.min(this.x,l.x),this.y=Math.min(this.y,l.y),this.z=Math.min(this.z,l.z),this}max(l){return this.x=Math.max(this.x,l.x),this.y=Math.max(this.y,l.y),this.z=Math.max(this.z,l.z),this}clamp(l,n){return this.x=Math.max(l.x,Math.min(n.x,this.x)),this.y=Math.max(l.y,Math.min(n.y,this.y)),this.z=Math.max(l.z,Math.min(n.z,this.z)),this}clampScalar(l,n){return this.x=Math.max(l,Math.min(n,this.x)),this.y=Math.max(l,Math.min(n,this.y)),this.z=Math.max(l,Math.min(n,this.z)),this}clampLength(l,n){const t=this.length();return this.divideScalar(t||1).multiplyScalar(Math.max(l,Math.min(n,t)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(l){return this.x*l.x+this.y*l.y+this.z*l.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(l){return this.normalize().multiplyScalar(l)}lerp(l,n){return this.x+=(l.x-this.x)*n,this.y+=(l.y-this.y)*n,this.z+=(l.z-this.z)*n,this}lerpVectors(l,n,t){return this.x=l.x+(n.x-l.x)*t,this.y=l.y+(n.y-l.y)*t,this.z=l.z+(n.z-l.z)*t,this}cross(l){return this.crossVectors(this,l)}crossVectors(l,n){const t=l.x,c=l.y,y=l.z,A=n.x,g=n.y,U=n.z;return this.x=c*U-y*g,this.y=y*A-t*U,this.z=t*g-c*A,this}projectOnVector(l){const n=l.lengthSq();if(n===0)return this.set(0,0,0);const t=l.dot(this)/n;return this.copy(l).multiplyScalar(t)}projectOnPlane(l){return NG.copy(this).projectOnVector(l),this.sub(NG)}reflect(l){return this.sub(NG.copy(l).multiplyScalar(2*this.dot(l)))}angleTo(l){const n=Math.sqrt(this.lengthSq()*l.lengthSq());if(n===0)return Math.PI/2;const t=this.dot(l)/n;return Math.acos($f(t,-1,1))}distanceTo(l){return Math.sqrt(this.distanceToSquared(l))}distanceToSquared(l){const n=this.x-l.x,t=this.y-l.y,c=this.z-l.z;return n*n+t*t+c*c}manhattanDistanceTo(l){return Math.abs(this.x-l.x)+Math.abs(this.y-l.y)+Math.abs(this.z-l.z)}setFromSpherical(l){return this.setFromSphericalCoords(l.radius,l.phi,l.theta)}setFromSphericalCoords(l,n,t){const c=Math.sin(n)*l;return this.x=c*Math.sin(t),this.y=Math.cos(n)*l,this.z=c*Math.cos(t),this}setFromCylindrical(l){return this.setFromCylindricalCoords(l.radius,l.theta,l.y)}setFromCylindricalCoords(l,n,t){return this.x=l*Math.sin(n),this.y=t,this.z=l*Math.cos(n),this}setFromMatrixPosition(l){const n=l.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(l){const n=this.setFromMatrixColumn(l,0).length(),t=this.setFromMatrixColumn(l,1).length(),c=this.setFromMatrixColumn(l,2).length();return this.x=n,this.y=t,this.z=c,this}setFromMatrixColumn(l,n){return this.fromArray(l.elements,n*4)}setFromMatrix3Column(l,n){return this.fromArray(l.elements,n*3)}setFromEuler(l){return this.x=l._x,this.y=l._y,this.z=l._z,this}setFromColor(l){return this.x=l.r,this.y=l.g,this.z=l.b,this}equals(l){return l.x===this.x&&l.y===this.y&&l.z===this.z}fromArray(l,n=0){return this.x=l[n],this.y=l[n+1],this.z=l[n+2],this}toArray(l=[],n=0){return l[n]=this.x,l[n+1]=this.y,l[n+2]=this.z,l}fromBufferAttribute(l,n){return this.x=l.getX(n),this.y=l.getY(n),this.z=l.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const l=(Math.random()-.5)*2,n=Math.random()*Math.PI*2,t=Math.sqrt(1-l**2);return this.x=t*Math.cos(n),this.y=t*Math.sin(n),this.z=l,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const NG=new nt,bW=new TB;class rc{constructor(l=new nt(1/0,1/0,1/0),n=new nt(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=l,this.max=n}set(l,n){return this.min.copy(l),this.max.copy(n),this}setFromArray(l){this.makeEmpty();for(let n=0,t=l.length;n<t;n+=3)this.expandByPoint(vw.fromArray(l,n));return this}setFromBufferAttribute(l){this.makeEmpty();for(let n=0,t=l.count;n<t;n++)this.expandByPoint(vw.fromBufferAttribute(l,n));return this}setFromPoints(l){this.makeEmpty();for(let n=0,t=l.length;n<t;n++)this.expandByPoint(l[n]);return this}setFromCenterAndSize(l,n){const t=vw.copy(n).multiplyScalar(.5);return this.min.copy(l).sub(t),this.max.copy(l).add(t),this}setFromObject(l,n=!1){return this.makeEmpty(),this.expandByObject(l,n)}clone(){return new this.constructor().copy(this)}copy(l){return this.min.copy(l.min),this.max.copy(l.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(l){return this.isEmpty()?l.set(0,0,0):l.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(l){return this.isEmpty()?l.set(0,0,0):l.subVectors(this.max,this.min)}expandByPoint(l){return this.min.min(l),this.max.max(l),this}expandByVector(l){return this.min.sub(l),this.max.add(l),this}expandByScalar(l){return this.min.addScalar(-l),this.max.addScalar(l),this}expandByObject(l,n=!1){l.updateWorldMatrix(!1,!1);const t=l.geometry;if(t!==void 0){const y=t.getAttribute("position");if(n===!0&&y!==void 0&&l.isInstancedMesh!==!0)for(let A=0,g=y.count;A<g;A++)l.isMesh===!0?l.getVertexPosition(A,vw):vw.fromBufferAttribute(y,A),vw.applyMatrix4(l.matrixWorld),this.expandByPoint(vw);else l.boundingBox!==void 0?(l.boundingBox===null&&l.computeBoundingBox(),HB.copy(l.boundingBox)):(t.boundingBox===null&&t.computeBoundingBox(),HB.copy(t.boundingBox)),HB.applyMatrix4(l.matrixWorld),this.union(HB)}const c=l.children;for(let y=0,A=c.length;y<A;y++)this.expandByObject(c[y],n);return this}containsPoint(l){return!(l.x<this.min.x||l.x>this.max.x||l.y<this.min.y||l.y>this.max.y||l.z<this.min.z||l.z>this.max.z)}containsBox(l){return this.min.x<=l.min.x&&l.max.x<=this.max.x&&this.min.y<=l.min.y&&l.max.y<=this.max.y&&this.min.z<=l.min.z&&l.max.z<=this.max.z}getParameter(l,n){return n.set((l.x-this.min.x)/(this.max.x-this.min.x),(l.y-this.min.y)/(this.max.y-this.min.y),(l.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(l){return!(l.max.x<this.min.x||l.min.x>this.max.x||l.max.y<this.min.y||l.min.y>this.max.y||l.max.z<this.min.z||l.min.z>this.max.z)}intersectsSphere(l){return this.clampPoint(l.center,vw),vw.distanceToSquared(l.center)<=l.radius*l.radius}intersectsPlane(l){let n,t;return l.normal.x>0?(n=l.normal.x*this.min.x,t=l.normal.x*this.max.x):(n=l.normal.x*this.max.x,t=l.normal.x*this.min.x),l.normal.y>0?(n+=l.normal.y*this.min.y,t+=l.normal.y*this.max.y):(n+=l.normal.y*this.max.y,t+=l.normal.y*this.min.y),l.normal.z>0?(n+=l.normal.z*this.min.z,t+=l.normal.z*this.max.z):(n+=l.normal.z*this.max.z,t+=l.normal.z*this.min.z),n<=-l.constant&&t>=-l.constant}intersectsTriangle(l){if(this.isEmpty())return!1;this.getCenter(Xx),BB.subVectors(this.max,Xx),LP.subVectors(l.a,Xx),OP.subVectors(l.b,Xx),gP.subVectors(l.c,Xx),QD.subVectors(OP,LP),$D.subVectors(gP,OP),u8.subVectors(LP,gP);let n=[0,-QD.z,QD.y,0,-$D.z,$D.y,0,-u8.z,u8.y,QD.z,0,-QD.x,$D.z,0,-$D.x,u8.z,0,-u8.x,-QD.y,QD.x,0,-$D.y,$D.x,0,-u8.y,u8.x,0];return!AG(n,LP,OP,gP,BB)||(n=[1,0,0,0,1,0,0,0,1],!AG(n,LP,OP,gP,BB))?!1:(UB.crossVectors(QD,$D),n=[UB.x,UB.y,UB.z],AG(n,LP,OP,gP,BB))}clampPoint(l,n){return n.copy(l).clamp(this.min,this.max)}distanceToPoint(l){return this.clampPoint(l,vw).distanceTo(l)}getBoundingSphere(l){return this.isEmpty()?l.makeEmpty():(this.getCenter(l.center),l.radius=this.getSize(vw).length()*.5),l}intersect(l){return this.min.max(l.min),this.max.min(l.max),this.isEmpty()&&this.makeEmpty(),this}union(l){return this.min.min(l.min),this.max.max(l.max),this}applyMatrix4(l){return this.isEmpty()?this:(U6[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(l),U6[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(l),U6[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(l),U6[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(l),U6[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(l),U6[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(l),U6[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(l),U6[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(l),this.setFromPoints(U6),this)}translate(l){return this.min.add(l),this.max.add(l),this}equals(l){return l.min.equals(this.min)&&l.max.equals(this.max)}}const U6=[new nt,new nt,new nt,new nt,new nt,new nt,new nt,new nt],vw=new nt,HB=new rc,LP=new nt,OP=new nt,gP=new nt,QD=new nt,$D=new nt,u8=new nt,Xx=new nt,BB=new nt,UB=new nt,a8=new nt;function AG(e,l,n,t,c){for(let y=0,A=e.length-3;y<=A;y+=3){a8.fromArray(e,y);const g=c.x*Math.abs(a8.x)+c.y*Math.abs(a8.y)+c.z*Math.abs(a8.z),U=l.dot(a8),_=n.dot(a8),Q=t.dot(a8);if(Math.max(-Math.max(U,_,Q),Math.min(U,_,Q))>g)return!1}return!0}const uq=new rc,vx=new nt,SG=new nt;class DO{constructor(l=new nt,n=-1){this.isSphere=!0,this.center=l,this.radius=n}set(l,n){return this.center.copy(l),this.radius=n,this}setFromPoints(l,n){const t=this.center;n!==void 0?t.copy(n):uq.setFromPoints(l).getCenter(t);let c=0;for(let y=0,A=l.length;y<A;y++)c=Math.max(c,t.distanceToSquared(l[y]));return this.radius=Math.sqrt(c),this}copy(l){return this.center.copy(l.center),this.radius=l.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(l){return l.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(l){return l.distanceTo(this.center)-this.radius}intersectsSphere(l){const n=this.radius+l.radius;return l.center.distanceToSquared(this.center)<=n*n}intersectsBox(l){return l.intersectsSphere(this)}intersectsPlane(l){return Math.abs(l.distanceToPoint(this.center))<=this.radius}clampPoint(l,n){const t=this.center.distanceToSquared(l);return n.copy(l),t>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(l){return this.isEmpty()?(l.makeEmpty(),l):(l.set(this.center,this.center),l.expandByScalar(this.radius),l)}applyMatrix4(l){return this.center.applyMatrix4(l),this.radius=this.radius*l.getMaxScaleOnAxis(),this}translate(l){return this.center.add(l),this}expandByPoint(l){if(this.isEmpty())return this.center.copy(l),this.radius=0,this;vx.subVectors(l,this.center);const n=vx.lengthSq();if(n>this.radius*this.radius){const t=Math.sqrt(n),c=(t-this.radius)*.5;this.center.addScaledVector(vx,c/t),this.radius+=c}return this}union(l){return l.isEmpty()?this:this.isEmpty()?(this.copy(l),this):(this.center.equals(l.center)===!0?this.radius=Math.max(this.radius,l.radius):(SG.subVectors(l.center,this.center).setLength(l.radius),this.expandByPoint(vx.copy(l.center).add(SG)),this.expandByPoint(vx.copy(l.center).sub(SG))),this)}equals(l){return l.center.equals(this.center)&&l.radius===this.radius}clone(){return new this.constructor().copy(this)}}const F6=new nt,LG=new nt,FB=new nt,ZD=new nt,OG=new nt,GB=new nt,gG=new nt;class wF{constructor(l=new nt,n=new nt(0,0,-1)){this.origin=l,this.direction=n}set(l,n){return this.origin.copy(l),this.direction.copy(n),this}copy(l){return this.origin.copy(l.origin),this.direction.copy(l.direction),this}at(l,n){return n.copy(this.origin).addScaledVector(this.direction,l)}lookAt(l){return this.direction.copy(l).sub(this.origin).normalize(),this}recast(l){return this.origin.copy(this.at(l,F6)),this}closestPointToPoint(l,n){n.subVectors(l,this.origin);const t=n.dot(this.direction);return t<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,t)}distanceToPoint(l){return Math.sqrt(this.distanceSqToPoint(l))}distanceSqToPoint(l){const n=F6.subVectors(l,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(l):(F6.copy(this.origin).addScaledVector(this.direction,n),F6.distanceToSquared(l))}distanceSqToSegment(l,n,t,c){LG.copy(l).add(n).multiplyScalar(.5),FB.copy(n).sub(l).normalize(),ZD.copy(this.origin).sub(LG);const y=l.distanceTo(n)*.5,A=-this.direction.dot(FB),g=ZD.dot(this.direction),U=-ZD.dot(FB),_=ZD.lengthSq(),Q=Math.abs(1-A*A);let ee,J,te,he;if(Q>0)if(ee=A*U-g,J=A*g-U,he=y*Q,ee>=0)if(J>=-he)if(J<=he){const de=1/Q;ee*=de,J*=de,te=ee*(ee+A*J+2*g)+J*(A*ee+J+2*U)+_}else J=y,ee=Math.max(0,-(A*J+g)),te=-ee*ee+J*(J+2*U)+_;else J=-y,ee=Math.max(0,-(A*J+g)),te=-ee*ee+J*(J+2*U)+_;else J<=-he?(ee=Math.max(0,-(-A*y+g)),J=ee>0?-y:Math.min(Math.max(-y,-U),y),te=-ee*ee+J*(J+2*U)+_):J<=he?(ee=0,J=Math.min(Math.max(-y,-U),y),te=J*(J+2*U)+_):(ee=Math.max(0,-(A*y+g)),J=ee>0?y:Math.min(Math.max(-y,-U),y),te=-ee*ee+J*(J+2*U)+_);else J=A>0?-y:y,ee=Math.max(0,-(A*J+g)),te=-ee*ee+J*(J+2*U)+_;return t&&t.copy(this.origin).addScaledVector(this.direction,ee),c&&c.copy(LG).addScaledVector(FB,J),te}intersectSphere(l,n){F6.subVectors(l.center,this.origin);const t=F6.dot(this.direction),c=F6.dot(F6)-t*t,y=l.radius*l.radius;if(c>y)return null;const A=Math.sqrt(y-c),g=t-A,U=t+A;return U<0?null:g<0?this.at(U,n):this.at(g,n)}intersectsSphere(l){return this.distanceSqToPoint(l.center)<=l.radius*l.radius}distanceToPlane(l){const n=l.normal.dot(this.direction);if(n===0)return l.distanceToPoint(this.origin)===0?0:null;const t=-(this.origin.dot(l.normal)+l.constant)/n;return t>=0?t:null}intersectPlane(l,n){const t=this.distanceToPlane(l);return t===null?null:this.at(t,n)}intersectsPlane(l){const n=l.distanceToPoint(this.origin);return n===0||l.normal.dot(this.direction)*n<0}intersectBox(l,n){let t,c,y,A,g,U;const _=1/this.direction.x,Q=1/this.direction.y,ee=1/this.direction.z,J=this.origin;return _>=0?(t=(l.min.x-J.x)*_,c=(l.max.x-J.x)*_):(t=(l.max.x-J.x)*_,c=(l.min.x-J.x)*_),Q>=0?(y=(l.min.y-J.y)*Q,A=(l.max.y-J.y)*Q):(y=(l.max.y-J.y)*Q,A=(l.min.y-J.y)*Q),t>A||y>c||((y>t||isNaN(t))&&(t=y),(A<c||isNaN(c))&&(c=A),ee>=0?(g=(l.min.z-J.z)*ee,U=(l.max.z-J.z)*ee):(g=(l.max.z-J.z)*ee,U=(l.min.z-J.z)*ee),t>U||g>c)||((g>t||t!==t)&&(t=g),(U<c||c!==c)&&(c=U),c<0)?null:this.at(t>=0?t:c,n)}intersectsBox(l){return this.intersectBox(l,F6)!==null}intersectTriangle(l,n,t,c,y){OG.subVectors(n,l),GB.subVectors(t,l),gG.crossVectors(OG,GB);let A=this.direction.dot(gG),g;if(A>0){if(c)return null;g=1}else if(A<0)g=-1,A=-A;else return null;ZD.subVectors(this.origin,l);const U=g*this.direction.dot(GB.crossVectors(ZD,GB));if(U<0)return null;const _=g*this.direction.dot(OG.cross(ZD));if(_<0||U+_>A)return null;const Q=-g*ZD.dot(gG);return Q<0?null:this.at(Q/A,y)}applyMatrix4(l){return this.origin.applyMatrix4(l),this.direction.transformDirection(l),this}equals(l){return l.origin.equals(this.origin)&&l.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ll{constructor(l,n,t,c,y,A,g,U,_,Q,ee,J,te,he,de,oe){Ll.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],l!==void 0&&this.set(l,n,t,c,y,A,g,U,_,Q,ee,J,te,he,de,oe)}set(l,n,t,c,y,A,g,U,_,Q,ee,J,te,he,de,oe){const ie=this.elements;return ie[0]=l,ie[4]=n,ie[8]=t,ie[12]=c,ie[1]=y,ie[5]=A,ie[9]=g,ie[13]=U,ie[2]=_,ie[6]=Q,ie[10]=ee,ie[14]=J,ie[3]=te,ie[7]=he,ie[11]=de,ie[15]=oe,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ll().fromArray(this.elements)}copy(l){const n=this.elements,t=l.elements;return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],this}copyPosition(l){const n=this.elements,t=l.elements;return n[12]=t[12],n[13]=t[13],n[14]=t[14],this}setFromMatrix3(l){const n=l.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(l,n,t){return l.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),t.setFromMatrixColumn(this,2),this}makeBasis(l,n,t){return this.set(l.x,n.x,t.x,0,l.y,n.y,t.y,0,l.z,n.z,t.z,0,0,0,0,1),this}extractRotation(l){const n=this.elements,t=l.elements,c=1/PP.setFromMatrixColumn(l,0).length(),y=1/PP.setFromMatrixColumn(l,1).length(),A=1/PP.setFromMatrixColumn(l,2).length();return n[0]=t[0]*c,n[1]=t[1]*c,n[2]=t[2]*c,n[3]=0,n[4]=t[4]*y,n[5]=t[5]*y,n[6]=t[6]*y,n[7]=0,n[8]=t[8]*A,n[9]=t[9]*A,n[10]=t[10]*A,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(l){const n=this.elements,t=l.x,c=l.y,y=l.z,A=Math.cos(t),g=Math.sin(t),U=Math.cos(c),_=Math.sin(c),Q=Math.cos(y),ee=Math.sin(y);if(l.order==="XYZ"){const J=A*Q,te=A*ee,he=g*Q,de=g*ee;n[0]=U*Q,n[4]=-U*ee,n[8]=_,n[1]=te+he*_,n[5]=J-de*_,n[9]=-g*U,n[2]=de-J*_,n[6]=he+te*_,n[10]=A*U}else if(l.order==="YXZ"){const J=U*Q,te=U*ee,he=_*Q,de=_*ee;n[0]=J+de*g,n[4]=he*g-te,n[8]=A*_,n[1]=A*ee,n[5]=A*Q,n[9]=-g,n[2]=te*g-he,n[6]=de+J*g,n[10]=A*U}else if(l.order==="ZXY"){const J=U*Q,te=U*ee,he=_*Q,de=_*ee;n[0]=J-de*g,n[4]=-A*ee,n[8]=he+te*g,n[1]=te+he*g,n[5]=A*Q,n[9]=de-J*g,n[2]=-A*_,n[6]=g,n[10]=A*U}else if(l.order==="ZYX"){const J=A*Q,te=A*ee,he=g*Q,de=g*ee;n[0]=U*Q,n[4]=he*_-te,n[8]=J*_+de,n[1]=U*ee,n[5]=de*_+J,n[9]=te*_-he,n[2]=-_,n[6]=g*U,n[10]=A*U}else if(l.order==="YZX"){const J=A*U,te=A*_,he=g*U,de=g*_;n[0]=U*Q,n[4]=de-J*ee,n[8]=he*ee+te,n[1]=ee,n[5]=A*Q,n[9]=-g*Q,n[2]=-_*Q,n[6]=te*ee+he,n[10]=J-de*ee}else if(l.order==="XZY"){const J=A*U,te=A*_,he=g*U,de=g*_;n[0]=U*Q,n[4]=-ee,n[8]=_*Q,n[1]=J*ee+de,n[5]=A*Q,n[9]=te*ee-he,n[2]=he*ee-te,n[6]=g*Q,n[10]=de*ee+J}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(l){return this.compose(aq,l,iq)}lookAt(l,n,t){const c=this.elements;return C4.subVectors(l,n),C4.lengthSq()===0&&(C4.z=1),C4.normalize(),JD.crossVectors(t,C4),JD.lengthSq()===0&&(Math.abs(t.z)===1?C4.x+=1e-4:C4.z+=1e-4,C4.normalize(),JD.crossVectors(t,C4)),JD.normalize(),_B.crossVectors(C4,JD),c[0]=JD.x,c[4]=_B.x,c[8]=C4.x,c[1]=JD.y,c[5]=_B.y,c[9]=C4.y,c[2]=JD.z,c[6]=_B.z,c[10]=C4.z,this}multiply(l){return this.multiplyMatrices(this,l)}premultiply(l){return this.multiplyMatrices(l,this)}multiplyMatrices(l,n){const t=l.elements,c=n.elements,y=this.elements,A=t[0],g=t[4],U=t[8],_=t[12],Q=t[1],ee=t[5],J=t[9],te=t[13],he=t[2],de=t[6],oe=t[10],ie=t[14],Re=t[3],Ie=t[7],Ne=t[11],je=t[15],Be=c[0],Fe=c[4],Je=c[8],ge=c[12],Le=c[1],Xe=c[5],lt=c[9],ht=c[13],et=c[2],at=c[6],ft=c[10],Nt=c[14],bt=c[3],Ct=c[7],Ft=c[11],Ht=c[15];return y[0]=A*Be+g*Le+U*et+_*bt,y[4]=A*Fe+g*Xe+U*at+_*Ct,y[8]=A*Je+g*lt+U*ft+_*Ft,y[12]=A*ge+g*ht+U*Nt+_*Ht,y[1]=Q*Be+ee*Le+J*et+te*bt,y[5]=Q*Fe+ee*Xe+J*at+te*Ct,y[9]=Q*Je+ee*lt+J*ft+te*Ft,y[13]=Q*ge+ee*ht+J*Nt+te*Ht,y[2]=he*Be+de*Le+oe*et+ie*bt,y[6]=he*Fe+de*Xe+oe*at+ie*Ct,y[10]=he*Je+de*lt+oe*ft+ie*Ft,y[14]=he*ge+de*ht+oe*Nt+ie*Ht,y[3]=Re*Be+Ie*Le+Ne*et+je*bt,y[7]=Re*Fe+Ie*Xe+Ne*at+je*Ct,y[11]=Re*Je+Ie*lt+Ne*ft+je*Ft,y[15]=Re*ge+Ie*ht+Ne*Nt+je*Ht,this}multiplyScalar(l){const n=this.elements;return n[0]*=l,n[4]*=l,n[8]*=l,n[12]*=l,n[1]*=l,n[5]*=l,n[9]*=l,n[13]*=l,n[2]*=l,n[6]*=l,n[10]*=l,n[14]*=l,n[3]*=l,n[7]*=l,n[11]*=l,n[15]*=l,this}determinant(){const l=this.elements,n=l[0],t=l[4],c=l[8],y=l[12],A=l[1],g=l[5],U=l[9],_=l[13],Q=l[2],ee=l[6],J=l[10],te=l[14],he=l[3],de=l[7],oe=l[11],ie=l[15];return he*(+y*U*ee-c*_*ee-y*g*J+t*_*J+c*g*te-t*U*te)+de*(+n*U*te-n*_*J+y*A*J-c*A*te+c*_*Q-y*U*Q)+oe*(+n*_*ee-n*g*te-y*A*ee+t*A*te+y*g*Q-t*_*Q)+ie*(-c*g*Q-n*U*ee+n*g*J+c*A*ee-t*A*J+t*U*Q)}transpose(){const l=this.elements;let n;return n=l[1],l[1]=l[4],l[4]=n,n=l[2],l[2]=l[8],l[8]=n,n=l[6],l[6]=l[9],l[9]=n,n=l[3],l[3]=l[12],l[12]=n,n=l[7],l[7]=l[13],l[13]=n,n=l[11],l[11]=l[14],l[14]=n,this}setPosition(l,n,t){const c=this.elements;return l.isVector3?(c[12]=l.x,c[13]=l.y,c[14]=l.z):(c[12]=l,c[13]=n,c[14]=t),this}invert(){const l=this.elements,n=l[0],t=l[1],c=l[2],y=l[3],A=l[4],g=l[5],U=l[6],_=l[7],Q=l[8],ee=l[9],J=l[10],te=l[11],he=l[12],de=l[13],oe=l[14],ie=l[15],Re=ee*oe*_-de*J*_+de*U*te-g*oe*te-ee*U*ie+g*J*ie,Ie=he*J*_-Q*oe*_-he*U*te+A*oe*te+Q*U*ie-A*J*ie,Ne=Q*de*_-he*ee*_+he*g*te-A*de*te-Q*g*ie+A*ee*ie,je=he*ee*U-Q*de*U-he*g*J+A*de*J+Q*g*oe-A*ee*oe,Be=n*Re+t*Ie+c*Ne+y*je;if(Be===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const Fe=1/Be;return l[0]=Re*Fe,l[1]=(de*J*y-ee*oe*y-de*c*te+t*oe*te+ee*c*ie-t*J*ie)*Fe,l[2]=(g*oe*y-de*U*y+de*c*_-t*oe*_-g*c*ie+t*U*ie)*Fe,l[3]=(ee*U*y-g*J*y-ee*c*_+t*J*_+g*c*te-t*U*te)*Fe,l[4]=Ie*Fe,l[5]=(Q*oe*y-he*J*y+he*c*te-n*oe*te-Q*c*ie+n*J*ie)*Fe,l[6]=(he*U*y-A*oe*y-he*c*_+n*oe*_+A*c*ie-n*U*ie)*Fe,l[7]=(A*J*y-Q*U*y+Q*c*_-n*J*_-A*c*te+n*U*te)*Fe,l[8]=Ne*Fe,l[9]=(he*ee*y-Q*de*y-he*t*te+n*de*te+Q*t*ie-n*ee*ie)*Fe,l[10]=(A*de*y-he*g*y+he*t*_-n*de*_-A*t*ie+n*g*ie)*Fe,l[11]=(Q*g*y-A*ee*y-Q*t*_+n*ee*_+A*t*te-n*g*te)*Fe,l[12]=je*Fe,l[13]=(Q*de*c-he*ee*c+he*t*J-n*de*J-Q*t*oe+n*ee*oe)*Fe,l[14]=(he*g*c-A*de*c-he*t*U+n*de*U+A*t*oe-n*g*oe)*Fe,l[15]=(A*ee*c-Q*g*c+Q*t*U-n*ee*U-A*t*J+n*g*J)*Fe,this}scale(l){const n=this.elements,t=l.x,c=l.y,y=l.z;return n[0]*=t,n[4]*=c,n[8]*=y,n[1]*=t,n[5]*=c,n[9]*=y,n[2]*=t,n[6]*=c,n[10]*=y,n[3]*=t,n[7]*=c,n[11]*=y,this}getMaxScaleOnAxis(){const l=this.elements,n=l[0]*l[0]+l[1]*l[1]+l[2]*l[2],t=l[4]*l[4]+l[5]*l[5]+l[6]*l[6],c=l[8]*l[8]+l[9]*l[9]+l[10]*l[10];return Math.sqrt(Math.max(n,t,c))}makeTranslation(l,n,t){return l.isVector3?this.set(1,0,0,l.x,0,1,0,l.y,0,0,1,l.z,0,0,0,1):this.set(1,0,0,l,0,1,0,n,0,0,1,t,0,0,0,1),this}makeRotationX(l){const n=Math.cos(l),t=Math.sin(l);return this.set(1,0,0,0,0,n,-t,0,0,t,n,0,0,0,0,1),this}makeRotationY(l){const n=Math.cos(l),t=Math.sin(l);return this.set(n,0,t,0,0,1,0,0,-t,0,n,0,0,0,0,1),this}makeRotationZ(l){const n=Math.cos(l),t=Math.sin(l);return this.set(n,-t,0,0,t,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(l,n){const t=Math.cos(n),c=Math.sin(n),y=1-t,A=l.x,g=l.y,U=l.z,_=y*A,Q=y*g;return this.set(_*A+t,_*g-c*U,_*U+c*g,0,_*g+c*U,Q*g+t,Q*U-c*A,0,_*U-c*g,Q*U+c*A,y*U*U+t,0,0,0,0,1),this}makeScale(l,n,t){return this.set(l,0,0,0,0,n,0,0,0,0,t,0,0,0,0,1),this}makeShear(l,n,t,c,y,A){return this.set(1,t,y,0,l,1,A,0,n,c,1,0,0,0,0,1),this}compose(l,n,t){const c=this.elements,y=n._x,A=n._y,g=n._z,U=n._w,_=y+y,Q=A+A,ee=g+g,J=y*_,te=y*Q,he=y*ee,de=A*Q,oe=A*ee,ie=g*ee,Re=U*_,Ie=U*Q,Ne=U*ee,je=t.x,Be=t.y,Fe=t.z;return c[0]=(1-(de+ie))*je,c[1]=(te+Ne)*je,c[2]=(he-Ie)*je,c[3]=0,c[4]=(te-Ne)*Be,c[5]=(1-(J+ie))*Be,c[6]=(oe+Re)*Be,c[7]=0,c[8]=(he+Ie)*Fe,c[9]=(oe-Re)*Fe,c[10]=(1-(J+de))*Fe,c[11]=0,c[12]=l.x,c[13]=l.y,c[14]=l.z,c[15]=1,this}decompose(l,n,t){const c=this.elements;let y=PP.set(c[0],c[1],c[2]).length();const A=PP.set(c[4],c[5],c[6]).length(),g=PP.set(c[8],c[9],c[10]).length();this.determinant()<0&&(y=-y),l.x=c[12],l.y=c[13],l.z=c[14],eE.copy(this);const _=1/y,Q=1/A,ee=1/g;return eE.elements[0]*=_,eE.elements[1]*=_,eE.elements[2]*=_,eE.elements[4]*=Q,eE.elements[5]*=Q,eE.elements[6]*=Q,eE.elements[8]*=ee,eE.elements[9]*=ee,eE.elements[10]*=ee,n.setFromRotationMatrix(eE),t.x=y,t.y=A,t.z=g,this}makePerspective(l,n,t,c,y,A,g=h7){const U=this.elements,_=2*y/(n-l),Q=2*y/(t-c),ee=(n+l)/(n-l),J=(t+c)/(t-c);let te,he;if(g===h7)te=-(A+y)/(A-y),he=-2*A*y/(A-y);else if(g===cF)te=-A/(A-y),he=-A*y/(A-y);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+g);return U[0]=_,U[4]=0,U[8]=ee,U[12]=0,U[1]=0,U[5]=Q,U[9]=J,U[13]=0,U[2]=0,U[6]=0,U[10]=te,U[14]=he,U[3]=0,U[7]=0,U[11]=-1,U[15]=0,this}makeOrthographic(l,n,t,c,y,A,g=h7){const U=this.elements,_=1/(n-l),Q=1/(t-c),ee=1/(A-y),J=(n+l)*_,te=(t+c)*Q;let he,de;if(g===h7)he=(A+y)*ee,de=-2*ee;else if(g===cF)he=y*ee,de=-1*ee;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+g);return U[0]=2*_,U[4]=0,U[8]=0,U[12]=-J,U[1]=0,U[5]=2*Q,U[9]=0,U[13]=-te,U[2]=0,U[6]=0,U[10]=de,U[14]=-he,U[3]=0,U[7]=0,U[11]=0,U[15]=1,this}equals(l){const n=this.elements,t=l.elements;for(let c=0;c<16;c++)if(n[c]!==t[c])return!1;return!0}fromArray(l,n=0){for(let t=0;t<16;t++)this.elements[t]=l[t+n];return this}toArray(l=[],n=0){const t=this.elements;return l[n]=t[0],l[n+1]=t[1],l[n+2]=t[2],l[n+3]=t[3],l[n+4]=t[4],l[n+5]=t[5],l[n+6]=t[6],l[n+7]=t[7],l[n+8]=t[8],l[n+9]=t[9],l[n+10]=t[10],l[n+11]=t[11],l[n+12]=t[12],l[n+13]=t[13],l[n+14]=t[14],l[n+15]=t[15],l}}const PP=new nt,eE=new Ll,aq=new nt(0,0,0),iq=new nt(1,1,1),JD=new nt,_B=new nt,C4=new nt,CW=new Ll,MW=new TB;class EF{constructor(l=0,n=0,t=0,c=EF.DEFAULT_ORDER){this.isEuler=!0,this._x=l,this._y=n,this._z=t,this._order=c}get x(){return this._x}set x(l){this._x=l,this._onChangeCallback()}get y(){return this._y}set y(l){this._y=l,this._onChangeCallback()}get z(){return this._z}set z(l){this._z=l,this._onChangeCallback()}get order(){return this._order}set order(l){this._order=l,this._onChangeCallback()}set(l,n,t,c=this._order){return this._x=l,this._y=n,this._z=t,this._order=c,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(l){return this._x=l._x,this._y=l._y,this._z=l._z,this._order=l._order,this._onChangeCallback(),this}setFromRotationMatrix(l,n=this._order,t=!0){const c=l.elements,y=c[0],A=c[4],g=c[8],U=c[1],_=c[5],Q=c[9],ee=c[2],J=c[6],te=c[10];switch(n){case"XYZ":this._y=Math.asin($f(g,-1,1)),Math.abs(g)<.9999999?(this._x=Math.atan2(-Q,te),this._z=Math.atan2(-A,y)):(this._x=Math.atan2(J,_),this._z=0);break;case"YXZ":this._x=Math.asin(-$f(Q,-1,1)),Math.abs(Q)<.9999999?(this._y=Math.atan2(g,te),this._z=Math.atan2(U,_)):(this._y=Math.atan2(-ee,y),this._z=0);break;case"ZXY":this._x=Math.asin($f(J,-1,1)),Math.abs(J)<.9999999?(this._y=Math.atan2(-ee,te),this._z=Math.atan2(-A,_)):(this._y=0,this._z=Math.atan2(U,y));break;case"ZYX":this._y=Math.asin(-$f(ee,-1,1)),Math.abs(ee)<.9999999?(this._x=Math.atan2(J,te),this._z=Math.atan2(U,y)):(this._x=0,this._z=Math.atan2(-A,_));break;case"YZX":this._z=Math.asin($f(U,-1,1)),Math.abs(U)<.9999999?(this._x=Math.atan2(-Q,_),this._y=Math.atan2(-ee,y)):(this._x=0,this._y=Math.atan2(g,te));break;case"XZY":this._z=Math.asin(-$f(A,-1,1)),Math.abs(A)<.9999999?(this._x=Math.atan2(J,_),this._y=Math.atan2(g,y)):(this._x=Math.atan2(-Q,te),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,t===!0&&this._onChangeCallback(),this}setFromQuaternion(l,n,t){return CW.makeRotationFromQuaternion(l),this.setFromRotationMatrix(CW,n,t)}setFromVector3(l,n=this._order){return this.set(l.x,l.y,l.z,n)}reorder(l){return MW.setFromEuler(this),this.setFromQuaternion(MW,l)}equals(l){return l._x===this._x&&l._y===this._y&&l._z===this._z&&l._order===this._order}fromArray(l){return this._x=l[0],this._y=l[1],this._z=l[2],l[3]!==void 0&&(this._order=l[3]),this._onChangeCallback(),this}toArray(l=[],n=0){return l[n]=this._x,l[n+1]=this._y,l[n+2]=this._z,l[n+3]=this._order,l}_onChange(l){return this._onChangeCallback=l,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}EF.DEFAULT_ORDER="XYZ";class nV{constructor(){this.mask=1}set(l){this.mask=(1<<l|0)>>>0}enable(l){this.mask|=1<<l|0}enableAll(){this.mask=-1}toggle(l){this.mask^=1<<l|0}disable(l){this.mask&=~(1<<l|0)}disableAll(){this.mask=0}test(l){return(this.mask&l.mask)!==0}isEnabled(l){return(this.mask&(1<<l|0))!==0}}let oq=0;const xW=new nt,bP=new TB,G6=new Ll,VB=new nt,eH=new nt,cq=new nt,hq=new TB,HW=new nt(1,0,0),BW=new nt(0,1,0),UW=new nt(0,0,1),fq={type:"added"},Iq={type:"removed"};class vf extends $b{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:oq++}),this.uuid=_7(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=vf.DEFAULT_UP.clone();const l=new nt,n=new EF,t=new TB,c=new nt(1,1,1);function y(){t.setFromEuler(n,!1)}function A(){n.setFromQuaternion(t,void 0,!1)}n._onChange(y),t._onChange(A),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:l},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:t},scale:{configurable:!0,enumerable:!0,value:c},modelViewMatrix:{value:new Ll},normalMatrix:{value:new jl}}),this.matrix=new Ll,this.matrixWorld=new Ll,this.matrixAutoUpdate=vf.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=vf.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new nV,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(l){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(l),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(l){return this.quaternion.premultiply(l),this}setRotationFromAxisAngle(l,n){this.quaternion.setFromAxisAngle(l,n)}setRotationFromEuler(l){this.quaternion.setFromEuler(l,!0)}setRotationFromMatrix(l){this.quaternion.setFromRotationMatrix(l)}setRotationFromQuaternion(l){this.quaternion.copy(l)}rotateOnAxis(l,n){return bP.setFromAxisAngle(l,n),this.quaternion.multiply(bP),this}rotateOnWorldAxis(l,n){return bP.setFromAxisAngle(l,n),this.quaternion.premultiply(bP),this}rotateX(l){return this.rotateOnAxis(HW,l)}rotateY(l){return this.rotateOnAxis(BW,l)}rotateZ(l){return this.rotateOnAxis(UW,l)}translateOnAxis(l,n){return xW.copy(l).applyQuaternion(this.quaternion),this.position.add(xW.multiplyScalar(n)),this}translateX(l){return this.translateOnAxis(HW,l)}translateY(l){return this.translateOnAxis(BW,l)}translateZ(l){return this.translateOnAxis(UW,l)}localToWorld(l){return this.updateWorldMatrix(!0,!1),l.applyMatrix4(this.matrixWorld)}worldToLocal(l){return this.updateWorldMatrix(!0,!1),l.applyMatrix4(G6.copy(this.matrixWorld).invert())}lookAt(l,n,t){l.isVector3?VB.copy(l):VB.set(l,n,t);const c=this.parent;this.updateWorldMatrix(!0,!1),eH.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?G6.lookAt(eH,VB,this.up):G6.lookAt(VB,eH,this.up),this.quaternion.setFromRotationMatrix(G6),c&&(G6.extractRotation(c.matrixWorld),bP.setFromRotationMatrix(G6),this.quaternion.premultiply(bP.invert()))}add(l){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return l===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",l),this):(l&&l.isObject3D?(l.parent!==null&&l.parent.remove(l),l.parent=this,this.children.push(l),l.dispatchEvent(fq)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",l),this)}remove(l){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.remove(arguments[t]);return this}const n=this.children.indexOf(l);return n!==-1&&(l.parent=null,this.children.splice(n,1),l.dispatchEvent(Iq)),this}removeFromParent(){const l=this.parent;return l!==null&&l.remove(this),this}clear(){return this.remove(...this.children)}attach(l){return this.updateWorldMatrix(!0,!1),G6.copy(this.matrixWorld).invert(),l.parent!==null&&(l.parent.updateWorldMatrix(!0,!1),G6.multiply(l.parent.matrixWorld)),l.applyMatrix4(G6),this.add(l),l.updateWorldMatrix(!1,!0),this}getObjectById(l){return this.getObjectByProperty("id",l)}getObjectByName(l){return this.getObjectByProperty("name",l)}getObjectByProperty(l,n){if(this[l]===n)return this;for(let t=0,c=this.children.length;t<c;t++){const A=this.children[t].getObjectByProperty(l,n);if(A!==void 0)return A}}getObjectsByProperty(l,n,t=[]){this[l]===n&&t.push(this);const c=this.children;for(let y=0,A=c.length;y<A;y++)c[y].getObjectsByProperty(l,n,t);return t}getWorldPosition(l){return this.updateWorldMatrix(!0,!1),l.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(l){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(eH,l,cq),l}getWorldScale(l){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(eH,hq,l),l}getWorldDirection(l){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return l.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(l){l(this);const n=this.children;for(let t=0,c=n.length;t<c;t++)n[t].traverse(l)}traverseVisible(l){if(this.visible===!1)return;l(this);const n=this.children;for(let t=0,c=n.length;t<c;t++)n[t].traverseVisible(l)}traverseAncestors(l){const n=this.parent;n!==null&&(l(n),n.traverseAncestors(l))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(l){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||l)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,l=!0);const n=this.children;for(let t=0,c=n.length;t<c;t++){const y=n[t];(y.matrixWorldAutoUpdate===!0||l===!0)&&y.updateMatrixWorld(l)}}updateWorldMatrix(l,n){const t=this.parent;if(l===!0&&t!==null&&t.matrixWorldAutoUpdate===!0&&t.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),n===!0){const c=this.children;for(let y=0,A=c.length;y<A;y++){const g=c[y];g.matrixWorldAutoUpdate===!0&&g.updateWorldMatrix(!1,!0)}}}toJSON(l){const n=l===void 0||typeof l=="string",t={};n&&(l={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},t.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const c={};c.uuid=this.uuid,c.type=this.type,this.name!==""&&(c.name=this.name),this.castShadow===!0&&(c.castShadow=!0),this.receiveShadow===!0&&(c.receiveShadow=!0),this.visible===!1&&(c.visible=!1),this.frustumCulled===!1&&(c.frustumCulled=!1),this.renderOrder!==0&&(c.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(c.userData=this.userData),c.layers=this.layers.mask,c.matrix=this.matrix.toArray(),c.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(c.matrixAutoUpdate=!1),this.isInstancedMesh&&(c.type="InstancedMesh",c.count=this.count,c.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(c.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(c.type="BatchedMesh",c.perObjectFrustumCulled=this.perObjectFrustumCulled,c.sortObjects=this.sortObjects,c.drawRanges=this._drawRanges,c.reservedRanges=this._reservedRanges,c.visibility=this._visibility,c.active=this._active,c.bounds=this._bounds.map(g=>({boxInitialized:g.boxInitialized,boxMin:g.box.min.toArray(),boxMax:g.box.max.toArray(),sphereInitialized:g.sphereInitialized,sphereRadius:g.sphere.radius,sphereCenter:g.sphere.center.toArray()})),c.maxGeometryCount=this._maxGeometryCount,c.maxVertexCount=this._maxVertexCount,c.maxIndexCount=this._maxIndexCount,c.geometryInitialized=this._geometryInitialized,c.geometryCount=this._geometryCount,c.matricesTexture=this._matricesTexture.toJSON(l),this.boundingSphere!==null&&(c.boundingSphere={center:c.boundingSphere.center.toArray(),radius:c.boundingSphere.radius}),this.boundingBox!==null&&(c.boundingBox={min:c.boundingBox.min.toArray(),max:c.boundingBox.max.toArray()}));function y(g,U){return g[U.uuid]===void 0&&(g[U.uuid]=U.toJSON(l)),U.uuid}if(this.isScene)this.background&&(this.background.isColor?c.background=this.background.toJSON():this.background.isTexture&&(c.background=this.background.toJSON(l).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(c.environment=this.environment.toJSON(l).uuid);else if(this.isMesh||this.isLine||this.isPoints){c.geometry=y(l.geometries,this.geometry);const g=this.geometry.parameters;if(g!==void 0&&g.shapes!==void 0){const U=g.shapes;if(Array.isArray(U))for(let _=0,Q=U.length;_<Q;_++){const ee=U[_];y(l.shapes,ee)}else y(l.shapes,U)}}if(this.isSkinnedMesh&&(c.bindMode=this.bindMode,c.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(y(l.skeletons,this.skeleton),c.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const g=[];for(let U=0,_=this.material.length;U<_;U++)g.push(y(l.materials,this.material[U]));c.material=g}else c.material=y(l.materials,this.material);if(this.children.length>0){c.children=[];for(let g=0;g<this.children.length;g++)c.children.push(this.children[g].toJSON(l).object)}if(this.animations.length>0){c.animations=[];for(let g=0;g<this.animations.length;g++){const U=this.animations[g];c.animations.push(y(l.animations,U))}}if(n){const g=A(l.geometries),U=A(l.materials),_=A(l.textures),Q=A(l.images),ee=A(l.shapes),J=A(l.skeletons),te=A(l.animations),he=A(l.nodes);g.length>0&&(t.geometries=g),U.length>0&&(t.materials=U),_.length>0&&(t.textures=_),Q.length>0&&(t.images=Q),ee.length>0&&(t.shapes=ee),J.length>0&&(t.skeletons=J),te.length>0&&(t.animations=te),he.length>0&&(t.nodes=he)}return t.object=c,t;function A(g){const U=[];for(const _ in g){const Q=g[_];delete Q.metadata,U.push(Q)}return U}}clone(l){return new this.constructor().copy(this,l)}copy(l,n=!0){if(this.name=l.name,this.up.copy(l.up),this.position.copy(l.position),this.rotation.order=l.rotation.order,this.quaternion.copy(l.quaternion),this.scale.copy(l.scale),this.matrix.copy(l.matrix),this.matrixWorld.copy(l.matrixWorld),this.matrixAutoUpdate=l.matrixAutoUpdate,this.matrixWorldAutoUpdate=l.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=l.matrixWorldNeedsUpdate,this.layers.mask=l.layers.mask,this.visible=l.visible,this.castShadow=l.castShadow,this.receiveShadow=l.receiveShadow,this.frustumCulled=l.frustumCulled,this.renderOrder=l.renderOrder,this.animations=l.animations.slice(),this.userData=JSON.parse(JSON.stringify(l.userData)),n===!0)for(let t=0;t<l.children.length;t++){const c=l.children[t];this.add(c.clone())}return this}}vf.DEFAULT_UP=new nt(0,1,0);vf.DEFAULT_MATRIX_AUTO_UPDATE=!0;vf.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const tE=new nt,_6=new nt,PG=new nt,V6=new nt,CP=new nt,MP=new nt,FW=new nt,bG=new nt,CG=new nt,MG=new nt;let WB=!1;class Zf{constructor(l=new nt,n=new nt,t=new nt){this.a=l,this.b=n,this.c=t}static getNormal(l,n,t,c){c.subVectors(t,n),tE.subVectors(l,n),c.cross(tE);const y=c.lengthSq();return y>0?c.multiplyScalar(1/Math.sqrt(y)):c.set(0,0,0)}static getBarycoord(l,n,t,c,y){tE.subVectors(c,n),_6.subVectors(t,n),PG.subVectors(l,n);const A=tE.dot(tE),g=tE.dot(_6),U=tE.dot(PG),_=_6.dot(_6),Q=_6.dot(PG),ee=A*_-g*g;if(ee===0)return y.set(0,0,0),null;const J=1/ee,te=(_*U-g*Q)*J,he=(A*Q-g*U)*J;return y.set(1-te-he,he,te)}static containsPoint(l,n,t,c){return this.getBarycoord(l,n,t,c,V6)===null?!1:V6.x>=0&&V6.y>=0&&V6.x+V6.y<=1}static getUV(l,n,t,c,y,A,g,U){return WB===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),WB=!0),this.getInterpolation(l,n,t,c,y,A,g,U)}static getInterpolation(l,n,t,c,y,A,g,U){return this.getBarycoord(l,n,t,c,V6)===null?(U.x=0,U.y=0,"z"in U&&(U.z=0),"w"in U&&(U.w=0),null):(U.setScalar(0),U.addScaledVector(y,V6.x),U.addScaledVector(A,V6.y),U.addScaledVector(g,V6.z),U)}static isFrontFacing(l,n,t,c){return tE.subVectors(t,n),_6.subVectors(l,n),tE.cross(_6).dot(c)<0}set(l,n,t){return this.a.copy(l),this.b.copy(n),this.c.copy(t),this}setFromPointsAndIndices(l,n,t,c){return this.a.copy(l[n]),this.b.copy(l[t]),this.c.copy(l[c]),this}setFromAttributeAndIndices(l,n,t,c){return this.a.fromBufferAttribute(l,n),this.b.fromBufferAttribute(l,t),this.c.fromBufferAttribute(l,c),this}clone(){return new this.constructor().copy(this)}copy(l){return this.a.copy(l.a),this.b.copy(l.b),this.c.copy(l.c),this}getArea(){return tE.subVectors(this.c,this.b),_6.subVectors(this.a,this.b),tE.cross(_6).length()*.5}getMidpoint(l){return l.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(l){return Zf.getNormal(this.a,this.b,this.c,l)}getPlane(l){return l.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(l,n){return Zf.getBarycoord(l,this.a,this.b,this.c,n)}getUV(l,n,t,c,y){return WB===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),WB=!0),Zf.getInterpolation(l,this.a,this.b,this.c,n,t,c,y)}getInterpolation(l,n,t,c,y){return Zf.getInterpolation(l,this.a,this.b,this.c,n,t,c,y)}containsPoint(l){return Zf.containsPoint(l,this.a,this.b,this.c)}isFrontFacing(l){return Zf.isFrontFacing(this.a,this.b,this.c,l)}intersectsBox(l){return l.intersectsTriangle(this)}closestPointToPoint(l,n){const t=this.a,c=this.b,y=this.c;let A,g;CP.subVectors(c,t),MP.subVectors(y,t),bG.subVectors(l,t);const U=CP.dot(bG),_=MP.dot(bG);if(U<=0&&_<=0)return n.copy(t);CG.subVectors(l,c);const Q=CP.dot(CG),ee=MP.dot(CG);if(Q>=0&&ee<=Q)return n.copy(c);const J=U*ee-Q*_;if(J<=0&&U>=0&&Q<=0)return A=U/(U-Q),n.copy(t).addScaledVector(CP,A);MG.subVectors(l,y);const te=CP.dot(MG),he=MP.dot(MG);if(he>=0&&te<=he)return n.copy(y);const de=te*_-U*he;if(de<=0&&_>=0&&he<=0)return g=_/(_-he),n.copy(t).addScaledVector(MP,g);const oe=Q*he-te*ee;if(oe<=0&&ee-Q>=0&&te-he>=0)return FW.subVectors(y,c),g=(ee-Q)/(ee-Q+(te-he)),n.copy(c).addScaledVector(FW,g);const ie=1/(oe+de+J);return A=de*ie,g=J*ie,n.copy(t).addScaledVector(CP,A).addScaledVector(MP,g)}equals(l){return l.a.equals(this.a)&&l.b.equals(this.b)&&l.c.equals(this.c)}}const TY={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},XD={h:0,s:0,l:0},jB={h:0,s:0,l:0};function xG(e,l,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(l-e)*6*n:n<1/2?l:n<2/3?e+(l-e)*6*(2/3-n):e}class Sl{constructor(l,n,t){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(l,n,t)}set(l,n,t){if(n===void 0&&t===void 0){const c=l;c&&c.isColor?this.copy(c):typeof c=="number"?this.setHex(c):typeof c=="string"&&this.setStyle(c)}else this.setRGB(l,n,t);return this}setScalar(l){return this.r=l,this.g=l,this.b=l,this}setHex(l,n=Qf){return l=Math.floor(l),this.r=(l>>16&255)/255,this.g=(l>>8&255)/255,this.b=(l&255)/255,qs.toWorkingColorSpace(this,n),this}setRGB(l,n,t,c=qs.workingColorSpace){return this.r=l,this.g=n,this.b=t,qs.toWorkingColorSpace(this,c),this}setHSL(l,n,t,c=qs.workingColorSpace){if(l=tV(l,1),n=$f(n,0,1),t=$f(t,0,1),n===0)this.r=this.g=this.b=t;else{const y=t<=.5?t*(1+n):t+n-t*n,A=2*t-y;this.r=xG(A,y,l+1/3),this.g=xG(A,y,l),this.b=xG(A,y,l-1/3)}return qs.toWorkingColorSpace(this,c),this}setStyle(l,n=Qf){function t(y){y!==void 0&&parseFloat(y)<1&&console.warn("THREE.Color: Alpha component of "+l+" will be ignored.")}let c;if(c=/^(\w+)\(([^\)]*)\)/.exec(l)){let y;const A=c[1],g=c[2];switch(A){case"rgb":case"rgba":if(y=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(g))return t(y[4]),this.setRGB(Math.min(255,parseInt(y[1],10))/255,Math.min(255,parseInt(y[2],10))/255,Math.min(255,parseInt(y[3],10))/255,n);if(y=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(g))return t(y[4]),this.setRGB(Math.min(100,parseInt(y[1],10))/100,Math.min(100,parseInt(y[2],10))/100,Math.min(100,parseInt(y[3],10))/100,n);break;case"hsl":case"hsla":if(y=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(g))return t(y[4]),this.setHSL(parseFloat(y[1])/360,parseFloat(y[2])/100,parseFloat(y[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+l)}}else if(c=/^\#([A-Fa-f\d]+)$/.exec(l)){const y=c[1],A=y.length;if(A===3)return this.setRGB(parseInt(y.charAt(0),16)/15,parseInt(y.charAt(1),16)/15,parseInt(y.charAt(2),16)/15,n);if(A===6)return this.setHex(parseInt(y,16),n);console.warn("THREE.Color: Invalid hex color "+l)}else if(l&&l.length>0)return this.setColorName(l,n);return this}setColorName(l,n=Qf){const t=TY[l.toLowerCase()];return t!==void 0?this.setHex(t,n):console.warn("THREE.Color: Unknown color "+l),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(l){return this.r=l.r,this.g=l.g,this.b=l.b,this}copySRGBToLinear(l){return this.r=gb(l.r),this.g=gb(l.g),this.b=gb(l.b),this}copyLinearToSRGB(l){return this.r=mG(l.r),this.g=mG(l.g),this.b=mG(l.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(l=Qf){return qs.fromWorkingColorSpace(zI.copy(this),l),Math.round($f(zI.r*255,0,255))*65536+Math.round($f(zI.g*255,0,255))*256+Math.round($f(zI.b*255,0,255))}getHexString(l=Qf){return("000000"+this.getHex(l).toString(16)).slice(-6)}getHSL(l,n=qs.workingColorSpace){qs.fromWorkingColorSpace(zI.copy(this),n);const t=zI.r,c=zI.g,y=zI.b,A=Math.max(t,c,y),g=Math.min(t,c,y);let U,_;const Q=(g+A)/2;if(g===A)U=0,_=0;else{const ee=A-g;switch(_=Q<=.5?ee/(A+g):ee/(2-A-g),A){case t:U=(c-y)/ee+(c<y?6:0);break;case c:U=(y-t)/ee+2;break;case y:U=(t-c)/ee+4;break}U/=6}return l.h=U,l.s=_,l.l=Q,l}getRGB(l,n=qs.workingColorSpace){return qs.fromWorkingColorSpace(zI.copy(this),n),l.r=zI.r,l.g=zI.g,l.b=zI.b,l}getStyle(l=Qf){qs.fromWorkingColorSpace(zI.copy(this),l);const n=zI.r,t=zI.g,c=zI.b;return l!==Qf?`color(${l} ${n.toFixed(3)} ${t.toFixed(3)} ${c.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(t*255)},${Math.round(c*255)})`}offsetHSL(l,n,t){return this.getHSL(XD),this.setHSL(XD.h+l,XD.s+n,XD.l+t)}add(l){return this.r+=l.r,this.g+=l.g,this.b+=l.b,this}addColors(l,n){return this.r=l.r+n.r,this.g=l.g+n.g,this.b=l.b+n.b,this}addScalar(l){return this.r+=l,this.g+=l,this.b+=l,this}sub(l){return this.r=Math.max(0,this.r-l.r),this.g=Math.max(0,this.g-l.g),this.b=Math.max(0,this.b-l.b),this}multiply(l){return this.r*=l.r,this.g*=l.g,this.b*=l.b,this}multiplyScalar(l){return this.r*=l,this.g*=l,this.b*=l,this}lerp(l,n){return this.r+=(l.r-this.r)*n,this.g+=(l.g-this.g)*n,this.b+=(l.b-this.b)*n,this}lerpColors(l,n,t){return this.r=l.r+(n.r-l.r)*t,this.g=l.g+(n.g-l.g)*t,this.b=l.b+(n.b-l.b)*t,this}lerpHSL(l,n){this.getHSL(XD),l.getHSL(jB);const t=YH(XD.h,jB.h,n),c=YH(XD.s,jB.s,n),y=YH(XD.l,jB.l,n);return this.setHSL(t,c,y),this}setFromVector3(l){return this.r=l.x,this.g=l.y,this.b=l.z,this}applyMatrix3(l){const n=this.r,t=this.g,c=this.b,y=l.elements;return this.r=y[0]*n+y[3]*t+y[6]*c,this.g=y[1]*n+y[4]*t+y[7]*c,this.b=y[2]*n+y[5]*t+y[8]*c,this}equals(l){return l.r===this.r&&l.g===this.g&&l.b===this.b}fromArray(l,n=0){return this.r=l[n],this.g=l[n+1],this.b=l[n+2],this}toArray(l=[],n=0){return l[n]=this.r,l[n+1]=this.g,l[n+2]=this.b,l}fromBufferAttribute(l,n){return this.r=l.getX(n),this.g=l.getY(n),this.b=l.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zI=new Sl;Sl.NAMES=TY;let dq=0;class NO extends $b{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:dq++}),this.uuid=_7(),this.name="",this.type="Material",this.blending=Lb,this.side=fR,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=i_,this.blendDst=o_,this.blendEquation=Z8,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Sl(0,0,0),this.blendAlpha=0,this.depthFunc=uF,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=AW,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=AP,this.stencilZFail=AP,this.stencilZPass=AP,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(l){this._alphaTest>0!=l>0&&this.version++,this._alphaTest=l}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(l){if(l!==void 0)for(const n in l){const t=l[n];if(t===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const c=this[n];if(c===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}c&&c.isColor?c.set(t):c&&c.isVector3&&t&&t.isVector3?c.copy(t):this[n]=t}}toJSON(l){const n=l===void 0||typeof l=="string";n&&(l={textures:{},images:{}});const t={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),this.color&&this.color.isColor&&(t.color=this.color.getHex()),this.roughness!==void 0&&(t.roughness=this.roughness),this.metalness!==void 0&&(t.metalness=this.metalness),this.sheen!==void 0&&(t.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(t.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(t.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(t.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(t.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(t.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(t.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(t.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(t.shininess=this.shininess),this.clearcoat!==void 0&&(t.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(t.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(t.clearcoatMap=this.clearcoatMap.toJSON(l).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(t.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(l).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(t.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(l).uuid,t.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(t.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(t.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(t.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(t.iridescenceMap=this.iridescenceMap.toJSON(l).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(t.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(l).uuid),this.anisotropy!==void 0&&(t.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(t.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(t.anisotropyMap=this.anisotropyMap.toJSON(l).uuid),this.map&&this.map.isTexture&&(t.map=this.map.toJSON(l).uuid),this.matcap&&this.matcap.isTexture&&(t.matcap=this.matcap.toJSON(l).uuid),this.alphaMap&&this.alphaMap.isTexture&&(t.alphaMap=this.alphaMap.toJSON(l).uuid),this.lightMap&&this.lightMap.isTexture&&(t.lightMap=this.lightMap.toJSON(l).uuid,t.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(t.aoMap=this.aoMap.toJSON(l).uuid,t.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(t.bumpMap=this.bumpMap.toJSON(l).uuid,t.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(t.normalMap=this.normalMap.toJSON(l).uuid,t.normalMapType=this.normalMapType,t.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(t.displacementMap=this.displacementMap.toJSON(l).uuid,t.displacementScale=this.displacementScale,t.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(t.roughnessMap=this.roughnessMap.toJSON(l).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(t.metalnessMap=this.metalnessMap.toJSON(l).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(t.emissiveMap=this.emissiveMap.toJSON(l).uuid),this.specularMap&&this.specularMap.isTexture&&(t.specularMap=this.specularMap.toJSON(l).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(t.specularIntensityMap=this.specularIntensityMap.toJSON(l).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(t.specularColorMap=this.specularColorMap.toJSON(l).uuid),this.envMap&&this.envMap.isTexture&&(t.envMap=this.envMap.toJSON(l).uuid,this.combine!==void 0&&(t.combine=this.combine)),this.envMapIntensity!==void 0&&(t.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(t.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(t.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(t.gradientMap=this.gradientMap.toJSON(l).uuid),this.transmission!==void 0&&(t.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(t.transmissionMap=this.transmissionMap.toJSON(l).uuid),this.thickness!==void 0&&(t.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(t.thicknessMap=this.thicknessMap.toJSON(l).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(t.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(t.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(t.size=this.size),this.shadowSide!==null&&(t.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(t.sizeAttenuation=this.sizeAttenuation),this.blending!==Lb&&(t.blending=this.blending),this.side!==fR&&(t.side=this.side),this.vertexColors===!0&&(t.vertexColors=!0),this.opacity<1&&(t.opacity=this.opacity),this.transparent===!0&&(t.transparent=!0),this.blendSrc!==i_&&(t.blendSrc=this.blendSrc),this.blendDst!==o_&&(t.blendDst=this.blendDst),this.blendEquation!==Z8&&(t.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(t.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(t.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(t.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(t.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(t.blendAlpha=this.blendAlpha),this.depthFunc!==uF&&(t.depthFunc=this.depthFunc),this.depthTest===!1&&(t.depthTest=this.depthTest),this.depthWrite===!1&&(t.depthWrite=this.depthWrite),this.colorWrite===!1&&(t.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(t.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==AW&&(t.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(t.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(t.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==AP&&(t.stencilFail=this.stencilFail),this.stencilZFail!==AP&&(t.stencilZFail=this.stencilZFail),this.stencilZPass!==AP&&(t.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(t.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(t.rotation=this.rotation),this.polygonOffset===!0&&(t.polygonOffset=!0),this.polygonOffsetFactor!==0&&(t.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(t.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(t.linewidth=this.linewidth),this.dashSize!==void 0&&(t.dashSize=this.dashSize),this.gapSize!==void 0&&(t.gapSize=this.gapSize),this.scale!==void 0&&(t.scale=this.scale),this.dithering===!0&&(t.dithering=!0),this.alphaTest>0&&(t.alphaTest=this.alphaTest),this.alphaHash===!0&&(t.alphaHash=!0),this.alphaToCoverage===!0&&(t.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(t.premultipliedAlpha=!0),this.forceSinglePass===!0&&(t.forceSinglePass=!0),this.wireframe===!0&&(t.wireframe=!0),this.wireframeLinewidth>1&&(t.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(t.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(t.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(t.flatShading=!0),this.visible===!1&&(t.visible=!1),this.toneMapped===!1&&(t.toneMapped=!1),this.fog===!1&&(t.fog=!1),Object.keys(this.userData).length>0&&(t.userData=this.userData);function c(y){const A=[];for(const g in y){const U=y[g];delete U.metadata,A.push(U)}return A}if(n){const y=c(l.textures),A=c(l.images);y.length>0&&(t.textures=y),A.length>0&&(t.images=A)}return t}clone(){return new this.constructor().copy(this)}copy(l){this.name=l.name,this.blending=l.blending,this.side=l.side,this.vertexColors=l.vertexColors,this.opacity=l.opacity,this.transparent=l.transparent,this.blendSrc=l.blendSrc,this.blendDst=l.blendDst,this.blendEquation=l.blendEquation,this.blendSrcAlpha=l.blendSrcAlpha,this.blendDstAlpha=l.blendDstAlpha,this.blendEquationAlpha=l.blendEquationAlpha,this.blendColor.copy(l.blendColor),this.blendAlpha=l.blendAlpha,this.depthFunc=l.depthFunc,this.depthTest=l.depthTest,this.depthWrite=l.depthWrite,this.stencilWriteMask=l.stencilWriteMask,this.stencilFunc=l.stencilFunc,this.stencilRef=l.stencilRef,this.stencilFuncMask=l.stencilFuncMask,this.stencilFail=l.stencilFail,this.stencilZFail=l.stencilZFail,this.stencilZPass=l.stencilZPass,this.stencilWrite=l.stencilWrite;const n=l.clippingPlanes;let t=null;if(n!==null){const c=n.length;t=new Array(c);for(let y=0;y!==c;++y)t[y]=n[y].clone()}return this.clippingPlanes=t,this.clipIntersection=l.clipIntersection,this.clipShadows=l.clipShadows,this.shadowSide=l.shadowSide,this.colorWrite=l.colorWrite,this.precision=l.precision,this.polygonOffset=l.polygonOffset,this.polygonOffsetFactor=l.polygonOffsetFactor,this.polygonOffsetUnits=l.polygonOffsetUnits,this.dithering=l.dithering,this.alphaTest=l.alphaTest,this.alphaHash=l.alphaHash,this.alphaToCoverage=l.alphaToCoverage,this.premultipliedAlpha=l.premultipliedAlpha,this.forceSinglePass=l.forceSinglePass,this.visible=l.visible,this.toneMapped=l.toneMapped,this.userData=JSON.parse(JSON.stringify(l.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(l){l===!0&&this.version++}}class pY extends NO{constructor(l){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Sl(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=J_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(l)}copy(l){return super.copy(l),this.color.copy(l.color),this.map=l.map,this.lightMap=l.lightMap,this.lightMapIntensity=l.lightMapIntensity,this.aoMap=l.aoMap,this.aoMapIntensity=l.aoMapIntensity,this.specularMap=l.specularMap,this.alphaMap=l.alphaMap,this.envMap=l.envMap,this.combine=l.combine,this.reflectivity=l.reflectivity,this.refractionRatio=l.refractionRatio,this.wireframe=l.wireframe,this.wireframeLinewidth=l.wireframeLinewidth,this.wireframeLinecap=l.wireframeLinecap,this.wireframeLinejoin=l.wireframeLinejoin,this.fog=l.fog,this}}const mi=new nt,YB=new Nl;class eI{constructor(l,n,t=!1){if(Array.isArray(l))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=l,this.itemSize=n,this.count=l!==void 0?l.length/n:0,this.normalized=t,this.usage=d_,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=BN,this.version=0}onUploadCallback(){}set needsUpdate(l){l===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(l){return this.usage=l,this}addUpdateRange(l,n){this.updateRanges.push({start:l,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(l){return this.name=l.name,this.array=new l.array.constructor(l.array),this.itemSize=l.itemSize,this.count=l.count,this.normalized=l.normalized,this.usage=l.usage,this.gpuType=l.gpuType,this}copyAt(l,n,t){l*=this.itemSize,t*=n.itemSize;for(let c=0,y=this.itemSize;c<y;c++)this.array[l+c]=n.array[t+c];return this}copyArray(l){return this.array.set(l),this}applyMatrix3(l){if(this.itemSize===2)for(let n=0,t=this.count;n<t;n++)YB.fromBufferAttribute(this,n),YB.applyMatrix3(l),this.setXY(n,YB.x,YB.y);else if(this.itemSize===3)for(let n=0,t=this.count;n<t;n++)mi.fromBufferAttribute(this,n),mi.applyMatrix3(l),this.setXYZ(n,mi.x,mi.y,mi.z);return this}applyMatrix4(l){for(let n=0,t=this.count;n<t;n++)mi.fromBufferAttribute(this,n),mi.applyMatrix4(l),this.setXYZ(n,mi.x,mi.y,mi.z);return this}applyNormalMatrix(l){for(let n=0,t=this.count;n<t;n++)mi.fromBufferAttribute(this,n),mi.applyNormalMatrix(l),this.setXYZ(n,mi.x,mi.y,mi.z);return this}transformDirection(l){for(let n=0,t=this.count;n<t;n++)mi.fromBufferAttribute(this,n),mi.transformDirection(l),this.setXYZ(n,mi.x,mi.y,mi.z);return this}set(l,n=0){return this.array.set(l,n),this}getComponent(l,n){let t=this.array[l*this.itemSize+n];return this.normalized&&(t=sp(t,this.array)),t}setComponent(l,n,t){return this.normalized&&(t=ks(t,this.array)),this.array[l*this.itemSize+n]=t,this}getX(l){let n=this.array[l*this.itemSize];return this.normalized&&(n=sp(n,this.array)),n}setX(l,n){return this.normalized&&(n=ks(n,this.array)),this.array[l*this.itemSize]=n,this}getY(l){let n=this.array[l*this.itemSize+1];return this.normalized&&(n=sp(n,this.array)),n}setY(l,n){return this.normalized&&(n=ks(n,this.array)),this.array[l*this.itemSize+1]=n,this}getZ(l){let n=this.array[l*this.itemSize+2];return this.normalized&&(n=sp(n,this.array)),n}setZ(l,n){return this.normalized&&(n=ks(n,this.array)),this.array[l*this.itemSize+2]=n,this}getW(l){let n=this.array[l*this.itemSize+3];return this.normalized&&(n=sp(n,this.array)),n}setW(l,n){return this.normalized&&(n=ks(n,this.array)),this.array[l*this.itemSize+3]=n,this}setXY(l,n,t){return l*=this.itemSize,this.normalized&&(n=ks(n,this.array),t=ks(t,this.array)),this.array[l+0]=n,this.array[l+1]=t,this}setXYZ(l,n,t,c){return l*=this.itemSize,this.normalized&&(n=ks(n,this.array),t=ks(t,this.array),c=ks(c,this.array)),this.array[l+0]=n,this.array[l+1]=t,this.array[l+2]=c,this}setXYZW(l,n,t,c,y){return l*=this.itemSize,this.normalized&&(n=ks(n,this.array),t=ks(t,this.array),c=ks(c,this.array),y=ks(y,this.array)),this.array[l+0]=n,this.array[l+1]=t,this.array[l+2]=c,this.array[l+3]=y,this}onUpload(l){return this.onUploadCallback=l,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const l={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(l.name=this.name),this.usage!==d_&&(l.usage=this.usage),l}}class RY extends eI{constructor(l,n,t){super(new Uint16Array(l),n,t)}}class mY extends eI{constructor(l,n,t){super(new Uint32Array(l),n,t)}}class $u extends eI{constructor(l,n,t){super(new Float32Array(l),n,t)}}let yq=0;const f2=new Ll,HG=new vf,xP=new nt,M4=new rc,tH=new rc,xc=new nt;class nc extends $b{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yq++}),this.uuid=_7(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(l){return Array.isArray(l)?this.index=new(dY(l)?mY:RY)(l,1):this.index=l,this}getAttribute(l){return this.attributes[l]}setAttribute(l,n){return this.attributes[l]=n,this}deleteAttribute(l){return delete this.attributes[l],this}hasAttribute(l){return this.attributes[l]!==void 0}addGroup(l,n,t=0){this.groups.push({start:l,count:n,materialIndex:t})}clearGroups(){this.groups=[]}setDrawRange(l,n){this.drawRange.start=l,this.drawRange.count=n}applyMatrix4(l){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(l),n.needsUpdate=!0);const t=this.attributes.normal;if(t!==void 0){const y=new jl().getNormalMatrix(l);t.applyNormalMatrix(y),t.needsUpdate=!0}const c=this.attributes.tangent;return c!==void 0&&(c.transformDirection(l),c.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(l){return f2.makeRotationFromQuaternion(l),this.applyMatrix4(f2),this}rotateX(l){return f2.makeRotationX(l),this.applyMatrix4(f2),this}rotateY(l){return f2.makeRotationY(l),this.applyMatrix4(f2),this}rotateZ(l){return f2.makeRotationZ(l),this.applyMatrix4(f2),this}translate(l,n,t){return f2.makeTranslation(l,n,t),this.applyMatrix4(f2),this}scale(l,n,t){return f2.makeScale(l,n,t),this.applyMatrix4(f2),this}lookAt(l){return HG.lookAt(l),HG.updateMatrix(),this.applyMatrix4(HG.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xP).negate(),this.translate(xP.x,xP.y,xP.z),this}setFromPoints(l){const n=[];for(let t=0,c=l.length;t<c;t++){const y=l[t];n.push(y.x,y.y,y.z||0)}return this.setAttribute("position",new $u(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new rc);const l=this.attributes.position,n=this.morphAttributes.position;if(l&&l.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new nt(-1/0,-1/0,-1/0),new nt(1/0,1/0,1/0));return}if(l!==void 0){if(this.boundingBox.setFromBufferAttribute(l),n)for(let t=0,c=n.length;t<c;t++){const y=n[t];M4.setFromBufferAttribute(y),this.morphTargetsRelative?(xc.addVectors(this.boundingBox.min,M4.min),this.boundingBox.expandByPoint(xc),xc.addVectors(this.boundingBox.max,M4.max),this.boundingBox.expandByPoint(xc)):(this.boundingBox.expandByPoint(M4.min),this.boundingBox.expandByPoint(M4.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new DO);const l=this.attributes.position,n=this.morphAttributes.position;if(l&&l.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new nt,1/0);return}if(l){const t=this.boundingSphere.center;if(M4.setFromBufferAttribute(l),n)for(let y=0,A=n.length;y<A;y++){const g=n[y];tH.setFromBufferAttribute(g),this.morphTargetsRelative?(xc.addVectors(M4.min,tH.min),M4.expandByPoint(xc),xc.addVectors(M4.max,tH.max),M4.expandByPoint(xc)):(M4.expandByPoint(tH.min),M4.expandByPoint(tH.max))}M4.getCenter(t);let c=0;for(let y=0,A=l.count;y<A;y++)xc.fromBufferAttribute(l,y),c=Math.max(c,t.distanceToSquared(xc));if(n)for(let y=0,A=n.length;y<A;y++){const g=n[y],U=this.morphTargetsRelative;for(let _=0,Q=g.count;_<Q;_++)xc.fromBufferAttribute(g,_),U&&(xP.fromBufferAttribute(l,_),xc.add(xP)),c=Math.max(c,t.distanceToSquared(xc))}this.boundingSphere.radius=Math.sqrt(c),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const l=this.index,n=this.attributes;if(l===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const t=l.array,c=n.position.array,y=n.normal.array,A=n.uv.array,g=c.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new eI(new Float32Array(4*g),4));const U=this.getAttribute("tangent").array,_=[],Q=[];for(let Le=0;Le<g;Le++)_[Le]=new nt,Q[Le]=new nt;const ee=new nt,J=new nt,te=new nt,he=new Nl,de=new Nl,oe=new Nl,ie=new nt,Re=new nt;function Ie(Le,Xe,lt){ee.fromArray(c,Le*3),J.fromArray(c,Xe*3),te.fromArray(c,lt*3),he.fromArray(A,Le*2),de.fromArray(A,Xe*2),oe.fromArray(A,lt*2),J.sub(ee),te.sub(ee),de.sub(he),oe.sub(he);const ht=1/(de.x*oe.y-oe.x*de.y);isFinite(ht)&&(ie.copy(J).multiplyScalar(oe.y).addScaledVector(te,-de.y).multiplyScalar(ht),Re.copy(te).multiplyScalar(de.x).addScaledVector(J,-oe.x).multiplyScalar(ht),_[Le].add(ie),_[Xe].add(ie),_[lt].add(ie),Q[Le].add(Re),Q[Xe].add(Re),Q[lt].add(Re))}let Ne=this.groups;Ne.length===0&&(Ne=[{start:0,count:t.length}]);for(let Le=0,Xe=Ne.length;Le<Xe;++Le){const lt=Ne[Le],ht=lt.start,et=lt.count;for(let at=ht,ft=ht+et;at<ft;at+=3)Ie(t[at+0],t[at+1],t[at+2])}const je=new nt,Be=new nt,Fe=new nt,Je=new nt;function ge(Le){Fe.fromArray(y,Le*3),Je.copy(Fe);const Xe=_[Le];je.copy(Xe),je.sub(Fe.multiplyScalar(Fe.dot(Xe))).normalize(),Be.crossVectors(Je,Xe);const ht=Be.dot(Q[Le])<0?-1:1;U[Le*4]=je.x,U[Le*4+1]=je.y,U[Le*4+2]=je.z,U[Le*4+3]=ht}for(let Le=0,Xe=Ne.length;Le<Xe;++Le){const lt=Ne[Le],ht=lt.start,et=lt.count;for(let at=ht,ft=ht+et;at<ft;at+=3)ge(t[at+0]),ge(t[at+1]),ge(t[at+2])}}computeVertexNormals(){const l=this.index,n=this.getAttribute("position");if(n!==void 0){let t=this.getAttribute("normal");if(t===void 0)t=new eI(new Float32Array(n.count*3),3),this.setAttribute("normal",t);else for(let J=0,te=t.count;J<te;J++)t.setXYZ(J,0,0,0);const c=new nt,y=new nt,A=new nt,g=new nt,U=new nt,_=new nt,Q=new nt,ee=new nt;if(l)for(let J=0,te=l.count;J<te;J+=3){const he=l.getX(J+0),de=l.getX(J+1),oe=l.getX(J+2);c.fromBufferAttribute(n,he),y.fromBufferAttribute(n,de),A.fromBufferAttribute(n,oe),Q.subVectors(A,y),ee.subVectors(c,y),Q.cross(ee),g.fromBufferAttribute(t,he),U.fromBufferAttribute(t,de),_.fromBufferAttribute(t,oe),g.add(Q),U.add(Q),_.add(Q),t.setXYZ(he,g.x,g.y,g.z),t.setXYZ(de,U.x,U.y,U.z),t.setXYZ(oe,_.x,_.y,_.z)}else for(let J=0,te=n.count;J<te;J+=3)c.fromBufferAttribute(n,J+0),y.fromBufferAttribute(n,J+1),A.fromBufferAttribute(n,J+2),Q.subVectors(A,y),ee.subVectors(c,y),Q.cross(ee),t.setXYZ(J+0,Q.x,Q.y,Q.z),t.setXYZ(J+1,Q.x,Q.y,Q.z),t.setXYZ(J+2,Q.x,Q.y,Q.z);this.normalizeNormals(),t.needsUpdate=!0}}normalizeNormals(){const l=this.attributes.normal;for(let n=0,t=l.count;n<t;n++)xc.fromBufferAttribute(l,n),xc.normalize(),l.setXYZ(n,xc.x,xc.y,xc.z)}toNonIndexed(){function l(g,U){const _=g.array,Q=g.itemSize,ee=g.normalized,J=new _.constructor(U.length*Q);let te=0,he=0;for(let de=0,oe=U.length;de<oe;de++){g.isInterleavedBufferAttribute?te=U[de]*g.data.stride+g.offset:te=U[de]*Q;for(let ie=0;ie<Q;ie++)J[he++]=_[te++]}return new eI(J,Q,ee)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new nc,t=this.index.array,c=this.attributes;for(const g in c){const U=c[g],_=l(U,t);n.setAttribute(g,_)}const y=this.morphAttributes;for(const g in y){const U=[],_=y[g];for(let Q=0,ee=_.length;Q<ee;Q++){const J=_[Q],te=l(J,t);U.push(te)}n.morphAttributes[g]=U}n.morphTargetsRelative=this.morphTargetsRelative;const A=this.groups;for(let g=0,U=A.length;g<U;g++){const _=A[g];n.addGroup(_.start,_.count,_.materialIndex)}return n}toJSON(){const l={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),Object.keys(this.userData).length>0&&(l.userData=this.userData),this.parameters!==void 0){const U=this.parameters;for(const _ in U)U[_]!==void 0&&(l[_]=U[_]);return l}l.data={attributes:{}};const n=this.index;n!==null&&(l.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const t=this.attributes;for(const U in t){const _=t[U];l.data.attributes[U]=_.toJSON(l.data)}const c={};let y=!1;for(const U in this.morphAttributes){const _=this.morphAttributes[U],Q=[];for(let ee=0,J=_.length;ee<J;ee++){const te=_[ee];Q.push(te.toJSON(l.data))}Q.length>0&&(c[U]=Q,y=!0)}y&&(l.data.morphAttributes=c,l.data.morphTargetsRelative=this.morphTargetsRelative);const A=this.groups;A.length>0&&(l.data.groups=JSON.parse(JSON.stringify(A)));const g=this.boundingSphere;return g!==null&&(l.data.boundingSphere={center:g.center.toArray(),radius:g.radius}),l}clone(){return new this.constructor().copy(this)}copy(l){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=l.name;const t=l.index;t!==null&&this.setIndex(t.clone(n));const c=l.attributes;for(const _ in c){const Q=c[_];this.setAttribute(_,Q.clone(n))}const y=l.morphAttributes;for(const _ in y){const Q=[],ee=y[_];for(let J=0,te=ee.length;J<te;J++)Q.push(ee[J].clone(n));this.morphAttributes[_]=Q}this.morphTargetsRelative=l.morphTargetsRelative;const A=l.groups;for(let _=0,Q=A.length;_<Q;_++){const ee=A[_];this.addGroup(ee.start,ee.count,ee.materialIndex)}const g=l.boundingBox;g!==null&&(this.boundingBox=g.clone());const U=l.boundingSphere;return U!==null&&(this.boundingSphere=U.clone()),this.drawRange.start=l.drawRange.start,this.drawRange.count=l.drawRange.count,this.userData=l.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const GW=new Ll,i8=new wF,zB=new DO,_W=new nt,HP=new nt,BP=new nt,UP=new nt,BG=new nt,kB=new nt,qB=new Nl,KB=new Nl,QB=new Nl,VW=new nt,WW=new nt,jW=new nt,$B=new nt,ZB=new nt;class w2 extends vf{constructor(l=new nc,n=new pY){super(),this.isMesh=!0,this.type="Mesh",this.geometry=l,this.material=n,this.updateMorphTargets()}copy(l,n){return super.copy(l,n),l.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=l.morphTargetInfluences.slice()),l.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},l.morphTargetDictionary)),this.material=Array.isArray(l.material)?l.material.slice():l.material,this.geometry=l.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,t=Object.keys(n);if(t.length>0){const c=n[t[0]];if(c!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let y=0,A=c.length;y<A;y++){const g=c[y].name||String(y);this.morphTargetInfluences.push(0),this.morphTargetDictionary[g]=y}}}}getVertexPosition(l,n){const t=this.geometry,c=t.attributes.position,y=t.morphAttributes.position,A=t.morphTargetsRelative;n.fromBufferAttribute(c,l);const g=this.morphTargetInfluences;if(y&&g){kB.set(0,0,0);for(let U=0,_=y.length;U<_;U++){const Q=g[U],ee=y[U];Q!==0&&(BG.fromBufferAttribute(ee,l),A?kB.addScaledVector(BG,Q):kB.addScaledVector(BG.sub(n),Q))}n.add(kB)}return n}raycast(l,n){const t=this.geometry,c=this.material,y=this.matrixWorld;c!==void 0&&(t.boundingSphere===null&&t.computeBoundingSphere(),zB.copy(t.boundingSphere),zB.applyMatrix4(y),i8.copy(l.ray).recast(l.near),!(zB.containsPoint(i8.origin)===!1&&(i8.intersectSphere(zB,_W)===null||i8.origin.distanceToSquared(_W)>(l.far-l.near)**2))&&(GW.copy(y).invert(),i8.copy(l.ray).applyMatrix4(GW),!(t.boundingBox!==null&&i8.intersectsBox(t.boundingBox)===!1)&&this._computeIntersections(l,n,i8)))}_computeIntersections(l,n,t){let c;const y=this.geometry,A=this.material,g=y.index,U=y.attributes.position,_=y.attributes.uv,Q=y.attributes.uv1,ee=y.attributes.normal,J=y.groups,te=y.drawRange;if(g!==null)if(Array.isArray(A))for(let he=0,de=J.length;he<de;he++){const oe=J[he],ie=A[oe.materialIndex],Re=Math.max(oe.start,te.start),Ie=Math.min(g.count,Math.min(oe.start+oe.count,te.start+te.count));for(let Ne=Re,je=Ie;Ne<je;Ne+=3){const Be=g.getX(Ne),Fe=g.getX(Ne+1),Je=g.getX(Ne+2);c=JB(this,ie,l,t,_,Q,ee,Be,Fe,Je),c&&(c.faceIndex=Math.floor(Ne/3),c.face.materialIndex=oe.materialIndex,n.push(c))}}else{const he=Math.max(0,te.start),de=Math.min(g.count,te.start+te.count);for(let oe=he,ie=de;oe<ie;oe+=3){const Re=g.getX(oe),Ie=g.getX(oe+1),Ne=g.getX(oe+2);c=JB(this,A,l,t,_,Q,ee,Re,Ie,Ne),c&&(c.faceIndex=Math.floor(oe/3),n.push(c))}}else if(U!==void 0)if(Array.isArray(A))for(let he=0,de=J.length;he<de;he++){const oe=J[he],ie=A[oe.materialIndex],Re=Math.max(oe.start,te.start),Ie=Math.min(U.count,Math.min(oe.start+oe.count,te.start+te.count));for(let Ne=Re,je=Ie;Ne<je;Ne+=3){const Be=Ne,Fe=Ne+1,Je=Ne+2;c=JB(this,ie,l,t,_,Q,ee,Be,Fe,Je),c&&(c.faceIndex=Math.floor(Ne/3),c.face.materialIndex=oe.materialIndex,n.push(c))}}else{const he=Math.max(0,te.start),de=Math.min(U.count,te.start+te.count);for(let oe=he,ie=de;oe<ie;oe+=3){const Re=oe,Ie=oe+1,Ne=oe+2;c=JB(this,A,l,t,_,Q,ee,Re,Ie,Ne),c&&(c.faceIndex=Math.floor(oe/3),n.push(c))}}}}function wq(e,l,n,t,c,y,A,g){let U;if(l.side===S3?U=t.intersectTriangle(A,y,c,!0,g):U=t.intersectTriangle(c,y,A,l.side===fR,g),U===null)return null;ZB.copy(g),ZB.applyMatrix4(e.matrixWorld);const _=n.ray.origin.distanceTo(ZB);return _<n.near||_>n.far?null:{distance:_,point:ZB.clone(),object:e}}function JB(e,l,n,t,c,y,A,g,U,_){e.getVertexPosition(g,HP),e.getVertexPosition(U,BP),e.getVertexPosition(_,UP);const Q=wq(e,l,n,t,HP,BP,UP,$B);if(Q){c&&(qB.fromBufferAttribute(c,g),KB.fromBufferAttribute(c,U),QB.fromBufferAttribute(c,_),Q.uv=Zf.getInterpolation($B,HP,BP,UP,qB,KB,QB,new Nl)),y&&(qB.fromBufferAttribute(y,g),KB.fromBufferAttribute(y,U),QB.fromBufferAttribute(y,_),Q.uv1=Zf.getInterpolation($B,HP,BP,UP,qB,KB,QB,new Nl),Q.uv2=Q.uv1),A&&(VW.fromBufferAttribute(A,g),WW.fromBufferAttribute(A,U),jW.fromBufferAttribute(A,_),Q.normal=Zf.getInterpolation($B,HP,BP,UP,VW,WW,jW,new nt),Q.normal.dot(t.direction)>0&&Q.normal.multiplyScalar(-1));const ee={a:g,b:U,c:_,normal:new nt,materialIndex:0};Zf.getNormal(HP,BP,UP,ee.normal),Q.face=ee}return Q}class pB extends nc{constructor(l=1,n=1,t=1,c=1,y=1,A=1){super(),this.type="BoxGeometry",this.parameters={width:l,height:n,depth:t,widthSegments:c,heightSegments:y,depthSegments:A};const g=this;c=Math.floor(c),y=Math.floor(y),A=Math.floor(A);const U=[],_=[],Q=[],ee=[];let J=0,te=0;he("z","y","x",-1,-1,t,n,l,A,y,0),he("z","y","x",1,-1,t,n,-l,A,y,1),he("x","z","y",1,1,l,t,n,c,A,2),he("x","z","y",1,-1,l,t,-n,c,A,3),he("x","y","z",1,-1,l,n,t,c,y,4),he("x","y","z",-1,-1,l,n,-t,c,y,5),this.setIndex(U),this.setAttribute("position",new $u(_,3)),this.setAttribute("normal",new $u(Q,3)),this.setAttribute("uv",new $u(ee,2));function he(de,oe,ie,Re,Ie,Ne,je,Be,Fe,Je,ge){const Le=Ne/Fe,Xe=je/Je,lt=Ne/2,ht=je/2,et=Be/2,at=Fe+1,ft=Je+1;let Nt=0,bt=0;const Ct=new nt;for(let Ft=0;Ft<ft;Ft++){const Ht=Ft*Xe-ht;for(let Ut=0;Ut<at;Ut++){const Lt=Ut*Le-lt;Ct[de]=Lt*Re,Ct[oe]=Ht*Ie,Ct[ie]=et,_.push(Ct.x,Ct.y,Ct.z),Ct[de]=0,Ct[oe]=0,Ct[ie]=Be>0?1:-1,Q.push(Ct.x,Ct.y,Ct.z),ee.push(Ut/Fe),ee.push(1-Ft/Je),Nt+=1}}for(let Ft=0;Ft<Je;Ft++)for(let Ht=0;Ht<Fe;Ht++){const Ut=J+Ht+at*Ft,Lt=J+Ht+at*(Ft+1),Bt=J+(Ht+1)+at*(Ft+1),Xt=J+(Ht+1)+at*Ft;U.push(Ut,Lt,Xt),U.push(Lt,Bt,Xt),bt+=6}g.addGroup(te,bt,ge),te+=bt,J+=Nt}}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}static fromJSON(l){return new pB(l.width,l.height,l.depth,l.widthSegments,l.heightSegments,l.depthSegments)}}function Bb(e){const l={};for(const n in e){l[n]={};for(const t in e[n]){const c=e[n][t];c&&(c.isColor||c.isMatrix3||c.isMatrix4||c.isVector2||c.isVector3||c.isVector4||c.isTexture||c.isQuaternion)?c.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),l[n][t]=null):l[n][t]=c.clone():Array.isArray(c)?l[n][t]=c.slice():l[n][t]=c}}return l}function l3(e){const l={};for(let n=0;n<e.length;n++){const t=Bb(e[n]);for(const c in t)l[c]=t[c]}return l}function Eq(e){const l=[];for(let n=0;n<e.length;n++)l.push(e[n].clone());return l}function DY(e){return e.getRenderTarget()===null?e.outputColorSpace:qs.workingColorSpace}const Tq={clone:Bb,merge:l3};var pq=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Rq=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wL extends NO{constructor(l){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pq,this.fragmentShader=Rq,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,l!==void 0&&this.setValues(l)}copy(l){return super.copy(l),this.fragmentShader=l.fragmentShader,this.vertexShader=l.vertexShader,this.uniforms=Bb(l.uniforms),this.uniformsGroups=Eq(l.uniformsGroups),this.defines=Object.assign({},l.defines),this.wireframe=l.wireframe,this.wireframeLinewidth=l.wireframeLinewidth,this.fog=l.fog,this.lights=l.lights,this.clipping=l.clipping,this.extensions=Object.assign({},l.extensions),this.glslVersion=l.glslVersion,this}toJSON(l){const n=super.toJSON(l);n.glslVersion=this.glslVersion,n.uniforms={};for(const c in this.uniforms){const A=this.uniforms[c].value;A&&A.isTexture?n.uniforms[c]={type:"t",value:A.toJSON(l).uuid}:A&&A.isColor?n.uniforms[c]={type:"c",value:A.getHex()}:A&&A.isVector2?n.uniforms[c]={type:"v2",value:A.toArray()}:A&&A.isVector3?n.uniforms[c]={type:"v3",value:A.toArray()}:A&&A.isVector4?n.uniforms[c]={type:"v4",value:A.toArray()}:A&&A.isMatrix3?n.uniforms[c]={type:"m3",value:A.toArray()}:A&&A.isMatrix4?n.uniforms[c]={type:"m4",value:A.toArray()}:n.uniforms[c]={value:A}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const t={};for(const c in this.extensions)this.extensions[c]===!0&&(t[c]=!0);return Object.keys(t).length>0&&(n.extensions=t),n}}class NY extends vf{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ll,this.projectionMatrix=new Ll,this.projectionMatrixInverse=new Ll,this.coordinateSystem=h7}copy(l,n){return super.copy(l,n),this.matrixWorldInverse.copy(l.matrixWorldInverse),this.projectionMatrix.copy(l.projectionMatrix),this.projectionMatrixInverse.copy(l.projectionMatrixInverse),this.coordinateSystem=l.coordinateSystem,this}getWorldDirection(l){return super.getWorldDirection(l).negate()}updateMatrixWorld(l){super.updateMatrixWorld(l),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(l,n){super.updateWorldMatrix(l,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class rE extends NY{constructor(l=50,n=1,t=.1,c=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=l,this.zoom=1,this.near=t,this.far=c,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(l,n){return super.copy(l,n),this.fov=l.fov,this.zoom=l.zoom,this.near=l.near,this.far=l.far,this.focus=l.focus,this.aspect=l.aspect,this.view=l.view===null?null:Object.assign({},l.view),this.filmGauge=l.filmGauge,this.filmOffset=l.filmOffset,this}setFocalLength(l){const n=.5*this.getFilmHeight()/l;this.fov=XH*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const l=Math.tan(Ob*.5*this.fov);return .5*this.getFilmHeight()/l}getEffectiveFOV(){return XH*2*Math.atan(Math.tan(Ob*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(l,n,t,c,y,A){this.aspect=l/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=l,this.view.fullHeight=n,this.view.offsetX=t,this.view.offsetY=c,this.view.width=y,this.view.height=A,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const l=this.near;let n=l*Math.tan(Ob*.5*this.fov)/this.zoom,t=2*n,c=this.aspect*t,y=-.5*c;const A=this.view;if(this.view!==null&&this.view.enabled){const U=A.fullWidth,_=A.fullHeight;y+=A.offsetX*c/U,n-=A.offsetY*t/_,c*=A.width/U,t*=A.height/_}const g=this.filmOffset;g!==0&&(y+=l*g/this.getFilmWidth()),this.projectionMatrix.makePerspective(y,y+c,n,n-t,l,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(l){const n=super.toJSON(l);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const FP=-90,GP=1;class mq extends vf{constructor(l,n,t){super(),this.type="CubeCamera",this.renderTarget=t,this.coordinateSystem=null,this.activeMipmapLevel=0;const c=new rE(FP,GP,l,n);c.layers=this.layers,this.add(c);const y=new rE(FP,GP,l,n);y.layers=this.layers,this.add(y);const A=new rE(FP,GP,l,n);A.layers=this.layers,this.add(A);const g=new rE(FP,GP,l,n);g.layers=this.layers,this.add(g);const U=new rE(FP,GP,l,n);U.layers=this.layers,this.add(U);const _=new rE(FP,GP,l,n);_.layers=this.layers,this.add(_)}updateCoordinateSystem(){const l=this.coordinateSystem,n=this.children.concat(),[t,c,y,A,g,U]=n;for(const _ of n)this.remove(_);if(l===h7)t.up.set(0,1,0),t.lookAt(1,0,0),c.up.set(0,1,0),c.lookAt(-1,0,0),y.up.set(0,0,-1),y.lookAt(0,1,0),A.up.set(0,0,1),A.lookAt(0,-1,0),g.up.set(0,1,0),g.lookAt(0,0,1),U.up.set(0,1,0),U.lookAt(0,0,-1);else if(l===cF)t.up.set(0,-1,0),t.lookAt(-1,0,0),c.up.set(0,-1,0),c.lookAt(1,0,0),y.up.set(0,0,1),y.lookAt(0,1,0),A.up.set(0,0,-1),A.lookAt(0,-1,0),g.up.set(0,-1,0),g.lookAt(0,0,1),U.up.set(0,-1,0),U.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+l);for(const _ of n)this.add(_),_.updateMatrixWorld()}update(l,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:t,activeMipmapLevel:c}=this;this.coordinateSystem!==l.coordinateSystem&&(this.coordinateSystem=l.coordinateSystem,this.updateCoordinateSystem());const[y,A,g,U,_,Q]=this.children,ee=l.getRenderTarget(),J=l.getActiveCubeFace(),te=l.getActiveMipmapLevel(),he=l.xr.enabled;l.xr.enabled=!1;const de=t.texture.generateMipmaps;t.texture.generateMipmaps=!1,l.setRenderTarget(t,0,c),l.render(n,y),l.setRenderTarget(t,1,c),l.render(n,A),l.setRenderTarget(t,2,c),l.render(n,g),l.setRenderTarget(t,3,c),l.render(n,U),l.setRenderTarget(t,4,c),l.render(n,_),t.texture.generateMipmaps=de,l.setRenderTarget(t,5,c),l.render(n,Q),l.setRenderTarget(ee,J,te),l.xr.enabled=he,t.texture.needsPMREMUpdate=!0}}class AY extends D0{constructor(l,n,t,c,y,A,g,U,_,Q){l=l!==void 0?l:[],n=n!==void 0?n:Mb,super(l,n,t,c,y,A,g,U,_,Q),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(l){this.image=l}}class Dq extends kN{constructor(l=1,n={}){super(l,l,n),this.isWebGLCubeRenderTarget=!0;const t={width:l,height:l,depth:1},c=[t,t,t,t,t,t];n.encoding!==void 0&&(zH("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===tL?Qf:y2),this.texture=new AY(c,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:d2}fromEquirectangularTexture(l,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const t={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},c=new pB(5,5,5),y=new wL({name:"CubemapFromEquirect",uniforms:Bb(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:S3,blending:VN});y.uniforms.tEquirect.value=n;const A=new w2(c,y),g=n.minFilter;return n.minFilter===ZH&&(n.minFilter=d2),new mq(1,10,this).update(l,A),n.minFilter=g,A.geometry.dispose(),A.material.dispose(),this}clear(l,n,t,c){const y=l.getRenderTarget();for(let A=0;A<6;A++)l.setRenderTarget(this,A),l.clear(n,t,c);l.setRenderTarget(y)}}const UG=new nt,Nq=new nt,Aq=new jl;class i7{constructor(l=new nt(1,0,0),n=0){this.isPlane=!0,this.normal=l,this.constant=n}set(l,n){return this.normal.copy(l),this.constant=n,this}setComponents(l,n,t,c){return this.normal.set(l,n,t),this.constant=c,this}setFromNormalAndCoplanarPoint(l,n){return this.normal.copy(l),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(l,n,t){const c=UG.subVectors(t,n).cross(Nq.subVectors(l,n)).normalize();return this.setFromNormalAndCoplanarPoint(c,l),this}copy(l){return this.normal.copy(l.normal),this.constant=l.constant,this}normalize(){const l=1/this.normal.length();return this.normal.multiplyScalar(l),this.constant*=l,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(l){return this.normal.dot(l)+this.constant}distanceToSphere(l){return this.distanceToPoint(l.center)-l.radius}projectPoint(l,n){return n.copy(l).addScaledVector(this.normal,-this.distanceToPoint(l))}intersectLine(l,n){const t=l.delta(UG),c=this.normal.dot(t);if(c===0)return this.distanceToPoint(l.start)===0?n.copy(l.start):null;const y=-(l.start.dot(this.normal)+this.constant)/c;return y<0||y>1?null:n.copy(l.start).addScaledVector(t,y)}intersectsLine(l){const n=this.distanceToPoint(l.start),t=this.distanceToPoint(l.end);return n<0&&t>0||t<0&&n>0}intersectsBox(l){return l.intersectsPlane(this)}intersectsSphere(l){return l.intersectsPlane(this)}coplanarPoint(l){return l.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(l,n){const t=n||Aq.getNormalMatrix(l),c=this.coplanarPoint(UG).applyMatrix4(l),y=this.normal.applyMatrix3(t).normalize();return this.constant=-c.dot(y),this}translate(l){return this.constant-=l.dot(this.normal),this}equals(l){return l.normal.equals(this.normal)&&l.constant===this.constant}clone(){return new this.constructor().copy(this)}}const o8=new DO,XB=new nt;class lV{constructor(l=new i7,n=new i7,t=new i7,c=new i7,y=new i7,A=new i7){this.planes=[l,n,t,c,y,A]}set(l,n,t,c,y,A){const g=this.planes;return g[0].copy(l),g[1].copy(n),g[2].copy(t),g[3].copy(c),g[4].copy(y),g[5].copy(A),this}copy(l){const n=this.planes;for(let t=0;t<6;t++)n[t].copy(l.planes[t]);return this}setFromProjectionMatrix(l,n=h7){const t=this.planes,c=l.elements,y=c[0],A=c[1],g=c[2],U=c[3],_=c[4],Q=c[5],ee=c[6],J=c[7],te=c[8],he=c[9],de=c[10],oe=c[11],ie=c[12],Re=c[13],Ie=c[14],Ne=c[15];if(t[0].setComponents(U-y,J-_,oe-te,Ne-ie).normalize(),t[1].setComponents(U+y,J+_,oe+te,Ne+ie).normalize(),t[2].setComponents(U+A,J+Q,oe+he,Ne+Re).normalize(),t[3].setComponents(U-A,J-Q,oe-he,Ne-Re).normalize(),t[4].setComponents(U-g,J-ee,oe-de,Ne-Ie).normalize(),n===h7)t[5].setComponents(U+g,J+ee,oe+de,Ne+Ie).normalize();else if(n===cF)t[5].setComponents(g,ee,de,Ie).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(l){if(l.boundingSphere!==void 0)l.boundingSphere===null&&l.computeBoundingSphere(),o8.copy(l.boundingSphere).applyMatrix4(l.matrixWorld);else{const n=l.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),o8.copy(n.boundingSphere).applyMatrix4(l.matrixWorld)}return this.intersectsSphere(o8)}intersectsSprite(l){return o8.center.set(0,0,0),o8.radius=.7071067811865476,o8.applyMatrix4(l.matrixWorld),this.intersectsSphere(o8)}intersectsSphere(l){const n=this.planes,t=l.center,c=-l.radius;for(let y=0;y<6;y++)if(n[y].distanceToPoint(t)<c)return!1;return!0}intersectsBox(l){const n=this.planes;for(let t=0;t<6;t++){const c=n[t];if(XB.x=c.normal.x>0?l.max.x:l.min.x,XB.y=c.normal.y>0?l.max.y:l.min.y,XB.z=c.normal.z>0?l.max.z:l.min.z,c.distanceToPoint(XB)<0)return!1}return!0}containsPoint(l){const n=this.planes;for(let t=0;t<6;t++)if(n[t].distanceToPoint(l)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function SY(){let e=null,l=!1,n=null,t=null;function c(y,A){n(y,A),t=e.requestAnimationFrame(c)}return{start:function(){l!==!0&&n!==null&&(t=e.requestAnimationFrame(c),l=!0)},stop:function(){e.cancelAnimationFrame(t),l=!1},setAnimationLoop:function(y){n=y},setContext:function(y){e=y}}}function Sq(e,l){const n=l.isWebGL2,t=new WeakMap;function c(_,Q){const ee=_.array,J=_.usage,te=ee.byteLength,he=e.createBuffer();e.bindBuffer(Q,he),e.bufferData(Q,ee,J),_.onUploadCallback();let de;if(ee instanceof Float32Array)de=e.FLOAT;else if(ee instanceof Uint16Array)if(_.isFloat16BufferAttribute)if(n)de=e.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else de=e.UNSIGNED_SHORT;else if(ee instanceof Int16Array)de=e.SHORT;else if(ee instanceof Uint32Array)de=e.UNSIGNED_INT;else if(ee instanceof Int32Array)de=e.INT;else if(ee instanceof Int8Array)de=e.BYTE;else if(ee instanceof Uint8Array)de=e.UNSIGNED_BYTE;else if(ee instanceof Uint8ClampedArray)de=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+ee);return{buffer:he,type:de,bytesPerElement:ee.BYTES_PER_ELEMENT,version:_.version,size:te}}function y(_,Q,ee){const J=Q.array,te=Q._updateRange,he=Q.updateRanges;if(e.bindBuffer(ee,_),te.count===-1&&he.length===0&&e.bufferSubData(ee,0,J),he.length!==0){for(let de=0,oe=he.length;de<oe;de++){const ie=he[de];n?e.bufferSubData(ee,ie.start*J.BYTES_PER_ELEMENT,J,ie.start,ie.count):e.bufferSubData(ee,ie.start*J.BYTES_PER_ELEMENT,J.subarray(ie.start,ie.start+ie.count))}Q.clearUpdateRanges()}te.count!==-1&&(n?e.bufferSubData(ee,te.offset*J.BYTES_PER_ELEMENT,J,te.offset,te.count):e.bufferSubData(ee,te.offset*J.BYTES_PER_ELEMENT,J.subarray(te.offset,te.offset+te.count)),te.count=-1),Q.onUploadCallback()}function A(_){return _.isInterleavedBufferAttribute&&(_=_.data),t.get(_)}function g(_){_.isInterleavedBufferAttribute&&(_=_.data);const Q=t.get(_);Q&&(e.deleteBuffer(Q.buffer),t.delete(_))}function U(_,Q){if(_.isGLBufferAttribute){const J=t.get(_);(!J||J.version<_.version)&&t.set(_,{buffer:_.buffer,type:_.type,bytesPerElement:_.elementSize,version:_.version});return}_.isInterleavedBufferAttribute&&(_=_.data);const ee=t.get(_);if(ee===void 0)t.set(_,c(_,Q));else if(ee.version<_.version){if(ee.size!==_.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");y(ee.buffer,_,Q),ee.version=_.version}}return{get:A,remove:g,update:U}}class sV extends nc{constructor(l=1,n=1,t=1,c=1){super(),this.type="PlaneGeometry",this.parameters={width:l,height:n,widthSegments:t,heightSegments:c};const y=l/2,A=n/2,g=Math.floor(t),U=Math.floor(c),_=g+1,Q=U+1,ee=l/g,J=n/U,te=[],he=[],de=[],oe=[];for(let ie=0;ie<Q;ie++){const Re=ie*J-A;for(let Ie=0;Ie<_;Ie++){const Ne=Ie*ee-y;he.push(Ne,-Re,0),de.push(0,0,1),oe.push(Ie/g),oe.push(1-ie/U)}}for(let ie=0;ie<U;ie++)for(let Re=0;Re<g;Re++){const Ie=Re+_*ie,Ne=Re+_*(ie+1),je=Re+1+_*(ie+1),Be=Re+1+_*ie;te.push(Ie,Ne,Be),te.push(Ne,je,Be)}this.setIndex(te),this.setAttribute("position",new $u(he,3)),this.setAttribute("normal",new $u(de,3)),this.setAttribute("uv",new $u(oe,2))}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}static fromJSON(l){return new sV(l.width,l.height,l.widthSegments,l.heightSegments)}}var Lq=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Oq=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,gq=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Pq=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bq=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Cq=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mq=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,xq=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Hq=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Bq=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Uq=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Fq=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gq=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,_q=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Vq=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Wq=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,jq=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Yq=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zq=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kq=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,qq=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kq=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Qq=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,$q=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zq=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Jq=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Xq=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vq=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,eK=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tK=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,nK="gl_FragColor = linearToOutputTexel( gl_FragColor );",lK=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,sK=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,rK=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,uK=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,aK=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,iK=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,oK=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cK=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,hK=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fK=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,IK=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,dK=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,yK=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,wK=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,EK=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,TK=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,pK=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,RK=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,mK=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,DK=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,NK=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,AK=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,SK=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,LK=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,OK=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,gK=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,PK=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bK=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,CK=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,MK=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,xK=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,HK=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,BK=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,UK=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,FK=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,GK=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_K=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,VK=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,WK=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,jK=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,YK=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,zK=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,kK=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qK=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,KK=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,QK=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,$K=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ZK=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,JK=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,XK=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vK=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,eQ=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,tQ=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,nQ=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lQ=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sQ=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rQ=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,uQ=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,aQ=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,iQ=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,oQ=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,cQ=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,hQ=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fQ=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,IQ=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,dQ=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,yQ=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wQ=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,EQ=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,TQ=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,pQ=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,RQ=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mQ=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,DQ=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,NQ=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,AQ=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const SQ=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,LQ=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,OQ=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gQ=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PQ=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bQ=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,CQ=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,MQ=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,xQ=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,HQ=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,BQ=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,UQ=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,FQ=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,GQ=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_Q=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,VQ=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WQ=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jQ=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,YQ=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,zQ=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kQ=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,qQ=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,KQ=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,QQ=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$Q=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ZQ=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,JQ=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,XQ=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vQ=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,e$=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,t$=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,n$=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,l$=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,s$=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,gl={alphahash_fragment:Lq,alphahash_pars_fragment:Oq,alphamap_fragment:gq,alphamap_pars_fragment:Pq,alphatest_fragment:bq,alphatest_pars_fragment:Cq,aomap_fragment:Mq,aomap_pars_fragment:xq,batching_pars_vertex:Hq,batching_vertex:Bq,begin_vertex:Uq,beginnormal_vertex:Fq,bsdfs:Gq,iridescence_fragment:_q,bumpmap_pars_fragment:Vq,clipping_planes_fragment:Wq,clipping_planes_pars_fragment:jq,clipping_planes_pars_vertex:Yq,clipping_planes_vertex:zq,color_fragment:kq,color_pars_fragment:qq,color_pars_vertex:Kq,color_vertex:Qq,common:$q,cube_uv_reflection_fragment:Zq,defaultnormal_vertex:Jq,displacementmap_pars_vertex:Xq,displacementmap_vertex:vq,emissivemap_fragment:eK,emissivemap_pars_fragment:tK,colorspace_fragment:nK,colorspace_pars_fragment:lK,envmap_fragment:sK,envmap_common_pars_fragment:rK,envmap_pars_fragment:uK,envmap_pars_vertex:aK,envmap_physical_pars_fragment:pK,envmap_vertex:iK,fog_vertex:oK,fog_pars_vertex:cK,fog_fragment:hK,fog_pars_fragment:fK,gradientmap_pars_fragment:IK,lightmap_fragment:dK,lightmap_pars_fragment:yK,lights_lambert_fragment:wK,lights_lambert_pars_fragment:EK,lights_pars_begin:TK,lights_toon_fragment:RK,lights_toon_pars_fragment:mK,lights_phong_fragment:DK,lights_phong_pars_fragment:NK,lights_physical_fragment:AK,lights_physical_pars_fragment:SK,lights_fragment_begin:LK,lights_fragment_maps:OK,lights_fragment_end:gK,logdepthbuf_fragment:PK,logdepthbuf_pars_fragment:bK,logdepthbuf_pars_vertex:CK,logdepthbuf_vertex:MK,map_fragment:xK,map_pars_fragment:HK,map_particle_fragment:BK,map_particle_pars_fragment:UK,metalnessmap_fragment:FK,metalnessmap_pars_fragment:GK,morphcolor_vertex:_K,morphnormal_vertex:VK,morphtarget_pars_vertex:WK,morphtarget_vertex:jK,normal_fragment_begin:YK,normal_fragment_maps:zK,normal_pars_fragment:kK,normal_pars_vertex:qK,normal_vertex:KK,normalmap_pars_fragment:QK,clearcoat_normal_fragment_begin:$K,clearcoat_normal_fragment_maps:ZK,clearcoat_pars_fragment:JK,iridescence_pars_fragment:XK,opaque_fragment:vK,packing:eQ,premultiplied_alpha_fragment:tQ,project_vertex:nQ,dithering_fragment:lQ,dithering_pars_fragment:sQ,roughnessmap_fragment:rQ,roughnessmap_pars_fragment:uQ,shadowmap_pars_fragment:aQ,shadowmap_pars_vertex:iQ,shadowmap_vertex:oQ,shadowmask_pars_fragment:cQ,skinbase_vertex:hQ,skinning_pars_vertex:fQ,skinning_vertex:IQ,skinnormal_vertex:dQ,specularmap_fragment:yQ,specularmap_pars_fragment:wQ,tonemapping_fragment:EQ,tonemapping_pars_fragment:TQ,transmission_fragment:pQ,transmission_pars_fragment:RQ,uv_pars_fragment:mQ,uv_pars_vertex:DQ,uv_vertex:NQ,worldpos_vertex:AQ,background_vert:SQ,background_frag:LQ,backgroundCube_vert:OQ,backgroundCube_frag:gQ,cube_vert:PQ,cube_frag:bQ,depth_vert:CQ,depth_frag:MQ,distanceRGBA_vert:xQ,distanceRGBA_frag:HQ,equirect_vert:BQ,equirect_frag:UQ,linedashed_vert:FQ,linedashed_frag:GQ,meshbasic_vert:_Q,meshbasic_frag:VQ,meshlambert_vert:WQ,meshlambert_frag:jQ,meshmatcap_vert:YQ,meshmatcap_frag:zQ,meshnormal_vert:kQ,meshnormal_frag:qQ,meshphong_vert:KQ,meshphong_frag:QQ,meshphysical_vert:$Q,meshphysical_frag:ZQ,meshtoon_vert:JQ,meshtoon_frag:XQ,points_vert:vQ,points_frag:e$,shadow_vert:t$,shadow_frag:n$,sprite_vert:l$,sprite_frag:s$},fn={common:{diffuse:{value:new Sl(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jl},alphaMap:{value:null},alphaMapTransform:{value:new jl},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jl}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jl}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jl}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jl},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jl},normalScale:{value:new Nl(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jl},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jl}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jl}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jl}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Sl(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Sl(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jl},alphaTest:{value:0},uvTransform:{value:new jl}},sprite:{diffuse:{value:new Sl(16777215)},opacity:{value:1},center:{value:new Nl(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jl},alphaMap:{value:null},alphaMapTransform:{value:new jl},alphaTest:{value:0}}},np={basic:{uniforms:l3([fn.common,fn.specularmap,fn.envmap,fn.aomap,fn.lightmap,fn.fog]),vertexShader:gl.meshbasic_vert,fragmentShader:gl.meshbasic_frag},lambert:{uniforms:l3([fn.common,fn.specularmap,fn.envmap,fn.aomap,fn.lightmap,fn.emissivemap,fn.bumpmap,fn.normalmap,fn.displacementmap,fn.fog,fn.lights,{emissive:{value:new Sl(0)}}]),vertexShader:gl.meshlambert_vert,fragmentShader:gl.meshlambert_frag},phong:{uniforms:l3([fn.common,fn.specularmap,fn.envmap,fn.aomap,fn.lightmap,fn.emissivemap,fn.bumpmap,fn.normalmap,fn.displacementmap,fn.fog,fn.lights,{emissive:{value:new Sl(0)},specular:{value:new Sl(1118481)},shininess:{value:30}}]),vertexShader:gl.meshphong_vert,fragmentShader:gl.meshphong_frag},standard:{uniforms:l3([fn.common,fn.envmap,fn.aomap,fn.lightmap,fn.emissivemap,fn.bumpmap,fn.normalmap,fn.displacementmap,fn.roughnessmap,fn.metalnessmap,fn.fog,fn.lights,{emissive:{value:new Sl(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:gl.meshphysical_vert,fragmentShader:gl.meshphysical_frag},toon:{uniforms:l3([fn.common,fn.aomap,fn.lightmap,fn.emissivemap,fn.bumpmap,fn.normalmap,fn.displacementmap,fn.gradientmap,fn.fog,fn.lights,{emissive:{value:new Sl(0)}}]),vertexShader:gl.meshtoon_vert,fragmentShader:gl.meshtoon_frag},matcap:{uniforms:l3([fn.common,fn.bumpmap,fn.normalmap,fn.displacementmap,fn.fog,{matcap:{value:null}}]),vertexShader:gl.meshmatcap_vert,fragmentShader:gl.meshmatcap_frag},points:{uniforms:l3([fn.points,fn.fog]),vertexShader:gl.points_vert,fragmentShader:gl.points_frag},dashed:{uniforms:l3([fn.common,fn.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:gl.linedashed_vert,fragmentShader:gl.linedashed_frag},depth:{uniforms:l3([fn.common,fn.displacementmap]),vertexShader:gl.depth_vert,fragmentShader:gl.depth_frag},normal:{uniforms:l3([fn.common,fn.bumpmap,fn.normalmap,fn.displacementmap,{opacity:{value:1}}]),vertexShader:gl.meshnormal_vert,fragmentShader:gl.meshnormal_frag},sprite:{uniforms:l3([fn.sprite,fn.fog]),vertexShader:gl.sprite_vert,fragmentShader:gl.sprite_frag},background:{uniforms:{uvTransform:{value:new jl},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:gl.background_vert,fragmentShader:gl.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:gl.backgroundCube_vert,fragmentShader:gl.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:gl.cube_vert,fragmentShader:gl.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:gl.equirect_vert,fragmentShader:gl.equirect_frag},distanceRGBA:{uniforms:l3([fn.common,fn.displacementmap,{referencePosition:{value:new nt},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:gl.distanceRGBA_vert,fragmentShader:gl.distanceRGBA_frag},shadow:{uniforms:l3([fn.lights,fn.fog,{color:{value:new Sl(0)},opacity:{value:1}}]),vertexShader:gl.shadow_vert,fragmentShader:gl.shadow_frag}};np.physical={uniforms:l3([np.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jl},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jl},clearcoatNormalScale:{value:new Nl(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jl},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jl},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jl},sheen:{value:0},sheenColor:{value:new Sl(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jl},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jl},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jl},transmissionSamplerSize:{value:new Nl},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jl},attenuationDistance:{value:0},attenuationColor:{value:new Sl(0)},specularColor:{value:new Sl(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jl},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jl},anisotropyVector:{value:new Nl},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jl}}]),vertexShader:gl.meshphysical_vert,fragmentShader:gl.meshphysical_frag};const vB={r:0,b:0,g:0};function r$(e,l,n,t,c,y,A){const g=new Sl(0);let U=y===!0?0:1,_,Q,ee=null,J=0,te=null;function he(oe,ie){let Re=!1,Ie=ie.isScene===!0?ie.background:null;Ie&&Ie.isTexture&&(Ie=(ie.backgroundBlurriness>0?n:l).get(Ie)),Ie===null?de(g,U):Ie&&Ie.isColor&&(de(Ie,1),Re=!0);const Ne=e.xr.getEnvironmentBlendMode();Ne==="additive"?t.buffers.color.setClear(0,0,0,1,A):Ne==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,A),(e.autoClear||Re)&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),Ie&&(Ie.isCubeTexture||Ie.mapping===dF)?(Q===void 0&&(Q=new w2(new pB(1,1,1),new wL({name:"BackgroundCubeMaterial",uniforms:Bb(np.backgroundCube.uniforms),vertexShader:np.backgroundCube.vertexShader,fragmentShader:np.backgroundCube.fragmentShader,side:S3,depthTest:!1,depthWrite:!1,fog:!1})),Q.geometry.deleteAttribute("normal"),Q.geometry.deleteAttribute("uv"),Q.onBeforeRender=function(je,Be,Fe){this.matrixWorld.copyPosition(Fe.matrixWorld)},Object.defineProperty(Q.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),c.update(Q)),Q.material.uniforms.envMap.value=Ie,Q.material.uniforms.flipEnvMap.value=Ie.isCubeTexture&&Ie.isRenderTargetTexture===!1?-1:1,Q.material.uniforms.backgroundBlurriness.value=ie.backgroundBlurriness,Q.material.uniforms.backgroundIntensity.value=ie.backgroundIntensity,Q.material.toneMapped=qs.getTransfer(Ie.colorSpace)!==yr,(ee!==Ie||J!==Ie.version||te!==e.toneMapping)&&(Q.material.needsUpdate=!0,ee=Ie,J=Ie.version,te=e.toneMapping),Q.layers.enableAll(),oe.unshift(Q,Q.geometry,Q.material,0,0,null)):Ie&&Ie.isTexture&&(_===void 0&&(_=new w2(new sV(2,2),new wL({name:"BackgroundMaterial",uniforms:Bb(np.background.uniforms),vertexShader:np.background.vertexShader,fragmentShader:np.background.fragmentShader,side:fR,depthTest:!1,depthWrite:!1,fog:!1})),_.geometry.deleteAttribute("normal"),Object.defineProperty(_.material,"map",{get:function(){return this.uniforms.t2D.value}}),c.update(_)),_.material.uniforms.t2D.value=Ie,_.material.uniforms.backgroundIntensity.value=ie.backgroundIntensity,_.material.toneMapped=qs.getTransfer(Ie.colorSpace)!==yr,Ie.matrixAutoUpdate===!0&&Ie.updateMatrix(),_.material.uniforms.uvTransform.value.copy(Ie.matrix),(ee!==Ie||J!==Ie.version||te!==e.toneMapping)&&(_.material.needsUpdate=!0,ee=Ie,J=Ie.version,te=e.toneMapping),_.layers.enableAll(),oe.unshift(_,_.geometry,_.material,0,0,null))}function de(oe,ie){oe.getRGB(vB,DY(e)),t.buffers.color.setClear(vB.r,vB.g,vB.b,ie,A)}return{getClearColor:function(){return g},setClearColor:function(oe,ie=1){g.set(oe),U=ie,de(g,U)},getClearAlpha:function(){return U},setClearAlpha:function(oe){U=oe,de(g,U)},render:he}}function u$(e,l,n,t){const c=e.getParameter(e.MAX_VERTEX_ATTRIBS),y=t.isWebGL2?null:l.get("OES_vertex_array_object"),A=t.isWebGL2||y!==null,g={},U=oe(null);let _=U,Q=!1;function ee(et,at,ft,Nt,bt){let Ct=!1;if(A){const Ft=de(Nt,ft,at);_!==Ft&&(_=Ft,te(_.object)),Ct=ie(et,Nt,ft,bt),Ct&&Re(et,Nt,ft,bt)}else{const Ft=at.wireframe===!0;(_.geometry!==Nt.id||_.program!==ft.id||_.wireframe!==Ft)&&(_.geometry=Nt.id,_.program=ft.id,_.wireframe=Ft,Ct=!0)}bt!==null&&n.update(bt,e.ELEMENT_ARRAY_BUFFER),(Ct||Q)&&(Q=!1,Je(et,at,ft,Nt),bt!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(bt).buffer))}function J(){return t.isWebGL2?e.createVertexArray():y.createVertexArrayOES()}function te(et){return t.isWebGL2?e.bindVertexArray(et):y.bindVertexArrayOES(et)}function he(et){return t.isWebGL2?e.deleteVertexArray(et):y.deleteVertexArrayOES(et)}function de(et,at,ft){const Nt=ft.wireframe===!0;let bt=g[et.id];bt===void 0&&(bt={},g[et.id]=bt);let Ct=bt[at.id];Ct===void 0&&(Ct={},bt[at.id]=Ct);let Ft=Ct[Nt];return Ft===void 0&&(Ft=oe(J()),Ct[Nt]=Ft),Ft}function oe(et){const at=[],ft=[],Nt=[];for(let bt=0;bt<c;bt++)at[bt]=0,ft[bt]=0,Nt[bt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:at,enabledAttributes:ft,attributeDivisors:Nt,object:et,attributes:{},index:null}}function ie(et,at,ft,Nt){const bt=_.attributes,Ct=at.attributes;let Ft=0;const Ht=ft.getAttributes();for(const Ut in Ht)if(Ht[Ut].location>=0){const Bt=bt[Ut];let Xt=Ct[Ut];if(Xt===void 0&&(Ut==="instanceMatrix"&&et.instanceMatrix&&(Xt=et.instanceMatrix),Ut==="instanceColor"&&et.instanceColor&&(Xt=et.instanceColor)),Bt===void 0||Bt.attribute!==Xt||Xt&&Bt.data!==Xt.data)return!0;Ft++}return _.attributesNum!==Ft||_.index!==Nt}function Re(et,at,ft,Nt){const bt={},Ct=at.attributes;let Ft=0;const Ht=ft.getAttributes();for(const Ut in Ht)if(Ht[Ut].location>=0){let Bt=Ct[Ut];Bt===void 0&&(Ut==="instanceMatrix"&&et.instanceMatrix&&(Bt=et.instanceMatrix),Ut==="instanceColor"&&et.instanceColor&&(Bt=et.instanceColor));const Xt={};Xt.attribute=Bt,Bt&&Bt.data&&(Xt.data=Bt.data),bt[Ut]=Xt,Ft++}_.attributes=bt,_.attributesNum=Ft,_.index=Nt}function Ie(){const et=_.newAttributes;for(let at=0,ft=et.length;at<ft;at++)et[at]=0}function Ne(et){je(et,0)}function je(et,at){const ft=_.newAttributes,Nt=_.enabledAttributes,bt=_.attributeDivisors;ft[et]=1,Nt[et]===0&&(e.enableVertexAttribArray(et),Nt[et]=1),bt[et]!==at&&((t.isWebGL2?e:l.get("ANGLE_instanced_arrays"))[t.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](et,at),bt[et]=at)}function Be(){const et=_.newAttributes,at=_.enabledAttributes;for(let ft=0,Nt=at.length;ft<Nt;ft++)at[ft]!==et[ft]&&(e.disableVertexAttribArray(ft),at[ft]=0)}function Fe(et,at,ft,Nt,bt,Ct,Ft){Ft===!0?e.vertexAttribIPointer(et,at,ft,bt,Ct):e.vertexAttribPointer(et,at,ft,Nt,bt,Ct)}function Je(et,at,ft,Nt){if(t.isWebGL2===!1&&(et.isInstancedMesh||Nt.isInstancedBufferGeometry)&&l.get("ANGLE_instanced_arrays")===null)return;Ie();const bt=Nt.attributes,Ct=ft.getAttributes(),Ft=at.defaultAttributeValues;for(const Ht in Ct){const Ut=Ct[Ht];if(Ut.location>=0){let Lt=bt[Ht];if(Lt===void 0&&(Ht==="instanceMatrix"&&et.instanceMatrix&&(Lt=et.instanceMatrix),Ht==="instanceColor"&&et.instanceColor&&(Lt=et.instanceColor)),Lt!==void 0){const Bt=Lt.normalized,Xt=Lt.itemSize,mn=n.get(Lt);if(mn===void 0)continue;const An=mn.buffer,Un=mn.type,Fn=mn.bytesPerElement,yn=t.isWebGL2===!0&&(Un===e.INT||Un===e.UNSIGNED_INT||Lt.gpuType===rY);if(Lt.isInterleavedBufferAttribute){const el=Lt.data,Tt=el.stride,Xl=Lt.offset;if(el.isInstancedInterleavedBuffer){for(let Mn=0;Mn<Ut.locationSize;Mn++)je(Ut.location+Mn,el.meshPerAttribute);et.isInstancedMesh!==!0&&Nt._maxInstanceCount===void 0&&(Nt._maxInstanceCount=el.meshPerAttribute*el.count)}else for(let Mn=0;Mn<Ut.locationSize;Mn++)Ne(Ut.location+Mn);e.bindBuffer(e.ARRAY_BUFFER,An);for(let Mn=0;Mn<Ut.locationSize;Mn++)Fe(Ut.location+Mn,Xt/Ut.locationSize,Un,Bt,Tt*Fn,(Xl+Xt/Ut.locationSize*Mn)*Fn,yn)}else{if(Lt.isInstancedBufferAttribute){for(let el=0;el<Ut.locationSize;el++)je(Ut.location+el,Lt.meshPerAttribute);et.isInstancedMesh!==!0&&Nt._maxInstanceCount===void 0&&(Nt._maxInstanceCount=Lt.meshPerAttribute*Lt.count)}else for(let el=0;el<Ut.locationSize;el++)Ne(Ut.location+el);e.bindBuffer(e.ARRAY_BUFFER,An);for(let el=0;el<Ut.locationSize;el++)Fe(Ut.location+el,Xt/Ut.locationSize,Un,Bt,Xt*Fn,Xt/Ut.locationSize*el*Fn,yn)}}else if(Ft!==void 0){const Bt=Ft[Ht];if(Bt!==void 0)switch(Bt.length){case 2:e.vertexAttrib2fv(Ut.location,Bt);break;case 3:e.vertexAttrib3fv(Ut.location,Bt);break;case 4:e.vertexAttrib4fv(Ut.location,Bt);break;default:e.vertexAttrib1fv(Ut.location,Bt)}}}}Be()}function ge(){lt();for(const et in g){const at=g[et];for(const ft in at){const Nt=at[ft];for(const bt in Nt)he(Nt[bt].object),delete Nt[bt];delete at[ft]}delete g[et]}}function Le(et){if(g[et.id]===void 0)return;const at=g[et.id];for(const ft in at){const Nt=at[ft];for(const bt in Nt)he(Nt[bt].object),delete Nt[bt];delete at[ft]}delete g[et.id]}function Xe(et){for(const at in g){const ft=g[at];if(ft[et.id]===void 0)continue;const Nt=ft[et.id];for(const bt in Nt)he(Nt[bt].object),delete Nt[bt];delete ft[et.id]}}function lt(){ht(),Q=!0,_!==U&&(_=U,te(_.object))}function ht(){U.geometry=null,U.program=null,U.wireframe=!1}return{setup:ee,reset:lt,resetDefaultState:ht,dispose:ge,releaseStatesOfGeometry:Le,releaseStatesOfProgram:Xe,initAttributes:Ie,enableAttribute:Ne,disableUnusedAttributes:Be}}function a$(e,l,n,t){const c=t.isWebGL2;let y;function A(Q){y=Q}function g(Q,ee){e.drawArrays(y,Q,ee),n.update(ee,y,1)}function U(Q,ee,J){if(J===0)return;let te,he;if(c)te=e,he="drawArraysInstanced";else if(te=l.get("ANGLE_instanced_arrays"),he="drawArraysInstancedANGLE",te===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}te[he](y,Q,ee,J),n.update(ee,y,J)}function _(Q,ee,J){if(J===0)return;const te=l.get("WEBGL_multi_draw");if(te===null)for(let he=0;he<J;he++)this.render(Q[he],ee[he]);else{te.multiDrawArraysWEBGL(y,Q,0,ee,0,J);let he=0;for(let de=0;de<J;de++)he+=ee[de];n.update(he,y,1)}}this.setMode=A,this.render=g,this.renderInstances=U,this.renderMultiDraw=_}function i$(e,l,n){let t;function c(){if(t!==void 0)return t;if(l.has("EXT_texture_filter_anisotropic")===!0){const Fe=l.get("EXT_texture_filter_anisotropic");t=e.getParameter(Fe.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else t=0;return t}function y(Fe){if(Fe==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";Fe="mediump"}return Fe==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const A=typeof WebGL2RenderingContext<"u"&&e.constructor.name==="WebGL2RenderingContext";let g=n.precision!==void 0?n.precision:"highp";const U=y(g);U!==g&&(console.warn("THREE.WebGLRenderer:",g,"not supported, using",U,"instead."),g=U);const _=A||l.has("WEBGL_draw_buffers"),Q=n.logarithmicDepthBuffer===!0,ee=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),J=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),te=e.getParameter(e.MAX_TEXTURE_SIZE),he=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),de=e.getParameter(e.MAX_VERTEX_ATTRIBS),oe=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),ie=e.getParameter(e.MAX_VARYING_VECTORS),Re=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),Ie=J>0,Ne=A||l.has("OES_texture_float"),je=Ie&&Ne,Be=A?e.getParameter(e.MAX_SAMPLES):0;return{isWebGL2:A,drawBuffers:_,getMaxAnisotropy:c,getMaxPrecision:y,precision:g,logarithmicDepthBuffer:Q,maxTextures:ee,maxVertexTextures:J,maxTextureSize:te,maxCubemapSize:he,maxAttributes:de,maxVertexUniforms:oe,maxVaryings:ie,maxFragmentUniforms:Re,vertexTextures:Ie,floatFragmentTextures:Ne,floatVertexTextures:je,maxSamples:Be}}function o$(e){const l=this;let n=null,t=0,c=!1,y=!1;const A=new i7,g=new jl,U={value:null,needsUpdate:!1};this.uniform=U,this.numPlanes=0,this.numIntersection=0,this.init=function(ee,J){const te=ee.length!==0||J||t!==0||c;return c=J,t=ee.length,te},this.beginShadows=function(){y=!0,Q(null)},this.endShadows=function(){y=!1},this.setGlobalState=function(ee,J){n=Q(ee,J,0)},this.setState=function(ee,J,te){const he=ee.clippingPlanes,de=ee.clipIntersection,oe=ee.clipShadows,ie=e.get(ee);if(!c||he===null||he.length===0||y&&!oe)y?Q(null):_();else{const Re=y?0:t,Ie=Re*4;let Ne=ie.clippingState||null;U.value=Ne,Ne=Q(he,J,Ie,te);for(let je=0;je!==Ie;++je)Ne[je]=n[je];ie.clippingState=Ne,this.numIntersection=de?this.numPlanes:0,this.numPlanes+=Re}};function _(){U.value!==n&&(U.value=n,U.needsUpdate=t>0),l.numPlanes=t,l.numIntersection=0}function Q(ee,J,te,he){const de=ee!==null?ee.length:0;let oe=null;if(de!==0){if(oe=U.value,he!==!0||oe===null){const ie=te+de*4,Re=J.matrixWorldInverse;g.getNormalMatrix(Re),(oe===null||oe.length<ie)&&(oe=new Float32Array(ie));for(let Ie=0,Ne=te;Ie!==de;++Ie,Ne+=4)A.copy(ee[Ie]).applyMatrix4(Re,g),A.normal.toArray(oe,Ne),oe[Ne+3]=A.constant}U.value=oe,U.needsUpdate=!0}return l.numPlanes=de,l.numIntersection=0,oe}}function c$(e){let l=new WeakMap;function n(A,g){return g===c_?A.mapping=Mb:g===h_&&(A.mapping=xb),A}function t(A){if(A&&A.isTexture){const g=A.mapping;if(g===c_||g===h_)if(l.has(A)){const U=l.get(A).texture;return n(U,A.mapping)}else{const U=A.image;if(U&&U.height>0){const _=new Dq(U.height/2);return _.fromEquirectangularTexture(e,A),l.set(A,_),A.addEventListener("dispose",c),n(_.texture,A.mapping)}else return null}}return A}function c(A){const g=A.target;g.removeEventListener("dispose",c);const U=l.get(g);U!==void 0&&(l.delete(g),U.dispose())}function y(){l=new WeakMap}return{get:t,dispose:y}}class LY extends NY{constructor(l=-1,n=1,t=1,c=-1,y=.1,A=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=l,this.right=n,this.top=t,this.bottom=c,this.near=y,this.far=A,this.updateProjectionMatrix()}copy(l,n){return super.copy(l,n),this.left=l.left,this.right=l.right,this.top=l.top,this.bottom=l.bottom,this.near=l.near,this.far=l.far,this.zoom=l.zoom,this.view=l.view===null?null:Object.assign({},l.view),this}setViewOffset(l,n,t,c,y,A){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=l,this.view.fullHeight=n,this.view.offsetX=t,this.view.offsetY=c,this.view.width=y,this.view.height=A,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const l=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),t=(this.right+this.left)/2,c=(this.top+this.bottom)/2;let y=t-l,A=t+l,g=c+n,U=c-n;if(this.view!==null&&this.view.enabled){const _=(this.right-this.left)/this.view.fullWidth/this.zoom,Q=(this.top-this.bottom)/this.view.fullHeight/this.zoom;y+=_*this.view.offsetX,A=y+_*this.view.width,g-=Q*this.view.offsetY,U=g-Q*this.view.height}this.projectionMatrix.makeOrthographic(y,A,g,U,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(l){const n=super.toJSON(l);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Rb=4,YW=[.125,.215,.35,.446,.526,.582],J8=20,FG=new LY,zW=new Sl;let GG=null,_G=0,VG=0;const c8=(1+Math.sqrt(5))/2,_P=1/c8,kW=[new nt(1,1,1),new nt(-1,1,1),new nt(1,1,-1),new nt(-1,1,-1),new nt(0,c8,_P),new nt(0,c8,-_P),new nt(_P,0,c8),new nt(-_P,0,c8),new nt(c8,_P,0),new nt(-c8,_P,0)];class qW{constructor(l){this._renderer=l,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(l,n=0,t=.1,c=100){GG=this._renderer.getRenderTarget(),_G=this._renderer.getActiveCubeFace(),VG=this._renderer.getActiveMipmapLevel(),this._setSize(256);const y=this._allocateTargets();return y.depthBuffer=!0,this._sceneToCubeUV(l,t,c,y),n>0&&this._blur(y,0,0,n),this._applyPMREM(y),this._cleanup(y),y}fromEquirectangular(l,n=null){return this._fromTexture(l,n)}fromCubemap(l,n=null){return this._fromTexture(l,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$W(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=QW(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(l){this._lodMax=Math.floor(Math.log2(l)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let l=0;l<this._lodPlanes.length;l++)this._lodPlanes[l].dispose()}_cleanup(l){this._renderer.setRenderTarget(GG,_G,VG),l.scissorTest=!1,eU(l,0,0,l.width,l.height)}_fromTexture(l,n){l.mapping===Mb||l.mapping===xb?this._setSize(l.image.length===0?16:l.image[0].width||l.image[0].image.width):this._setSize(l.image.width/4),GG=this._renderer.getRenderTarget(),_G=this._renderer.getActiveCubeFace(),VG=this._renderer.getActiveMipmapLevel();const t=n||this._allocateTargets();return this._textureToCubeUV(l,t),this._applyPMREM(t),this._cleanup(t),t}_allocateTargets(){const l=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,t={magFilter:d2,minFilter:d2,generateMipmaps:!1,type:JH,format:aE,colorSpace:tm,depthBuffer:!1},c=KW(l,n,t);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==l||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=KW(l,n,t);const{_lodMax:y}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=h$(y)),this._blurMaterial=f$(y,l,n)}return c}_compileMaterial(l){const n=new w2(this._lodPlanes[0],l);this._renderer.compile(n,FG)}_sceneToCubeUV(l,n,t,c){const g=new rE(90,1,n,t),U=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],Q=this._renderer,ee=Q.autoClear,J=Q.toneMapping;Q.getClearColor(zW),Q.toneMapping=WN,Q.autoClear=!1;const te=new pY({name:"PMREM.Background",side:S3,depthWrite:!1,depthTest:!1}),he=new w2(new pB,te);let de=!1;const oe=l.background;oe?oe.isColor&&(te.color.copy(oe),l.background=null,de=!0):(te.color.copy(zW),de=!0);for(let ie=0;ie<6;ie++){const Re=ie%3;Re===0?(g.up.set(0,U[ie],0),g.lookAt(_[ie],0,0)):Re===1?(g.up.set(0,0,U[ie]),g.lookAt(0,_[ie],0)):(g.up.set(0,U[ie],0),g.lookAt(0,0,_[ie]));const Ie=this._cubeSize;eU(c,Re*Ie,ie>2?Ie:0,Ie,Ie),Q.setRenderTarget(c),de&&Q.render(he,g),Q.render(l,g)}he.geometry.dispose(),he.material.dispose(),Q.toneMapping=J,Q.autoClear=ee,l.background=oe}_textureToCubeUV(l,n){const t=this._renderer,c=l.mapping===Mb||l.mapping===xb;c?(this._cubemapMaterial===null&&(this._cubemapMaterial=$W()),this._cubemapMaterial.uniforms.flipEnvMap.value=l.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=QW());const y=c?this._cubemapMaterial:this._equirectMaterial,A=new w2(this._lodPlanes[0],y),g=y.uniforms;g.envMap.value=l;const U=this._cubeSize;eU(n,0,0,3*U,2*U),t.setRenderTarget(n),t.render(A,FG)}_applyPMREM(l){const n=this._renderer,t=n.autoClear;n.autoClear=!1;for(let c=1;c<this._lodPlanes.length;c++){const y=Math.sqrt(this._sigmas[c]*this._sigmas[c]-this._sigmas[c-1]*this._sigmas[c-1]),A=kW[(c-1)%kW.length];this._blur(l,c-1,c,y,A)}n.autoClear=t}_blur(l,n,t,c,y){const A=this._pingPongRenderTarget;this._halfBlur(l,A,n,t,c,"latitudinal",y),this._halfBlur(A,l,t,t,c,"longitudinal",y)}_halfBlur(l,n,t,c,y,A,g){const U=this._renderer,_=this._blurMaterial;A!=="latitudinal"&&A!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const Q=3,ee=new w2(this._lodPlanes[c],_),J=_.uniforms,te=this._sizeLods[t]-1,he=isFinite(y)?Math.PI/(2*te):2*Math.PI/(2*J8-1),de=y/he,oe=isFinite(y)?1+Math.floor(Q*de):J8;oe>J8&&console.warn(`sigmaRadians, ${y}, is too large and will clip, as it requested ${oe} samples when the maximum is set to ${J8}`);const ie=[];let Re=0;for(let Fe=0;Fe<J8;++Fe){const Je=Fe/de,ge=Math.exp(-Je*Je/2);ie.push(ge),Fe===0?Re+=ge:Fe<oe&&(Re+=2*ge)}for(let Fe=0;Fe<ie.length;Fe++)ie[Fe]=ie[Fe]/Re;J.envMap.value=l.texture,J.samples.value=oe,J.weights.value=ie,J.latitudinal.value=A==="latitudinal",g&&(J.poleAxis.value=g);const{_lodMax:Ie}=this;J.dTheta.value=he,J.mipInt.value=Ie-t;const Ne=this._sizeLods[c],je=3*Ne*(c>Ie-Rb?c-Ie+Rb:0),Be=4*(this._cubeSize-Ne);eU(n,je,Be,3*Ne,2*Ne),U.setRenderTarget(n),U.render(ee,FG)}}function h$(e){const l=[],n=[],t=[];let c=e;const y=e-Rb+1+YW.length;for(let A=0;A<y;A++){const g=Math.pow(2,c);n.push(g);let U=1/g;A>e-Rb?U=YW[A-e+Rb-1]:A===0&&(U=0),t.push(U);const _=1/(g-2),Q=-_,ee=1+_,J=[Q,Q,ee,Q,ee,ee,Q,Q,ee,ee,Q,ee],te=6,he=6,de=3,oe=2,ie=1,Re=new Float32Array(de*he*te),Ie=new Float32Array(oe*he*te),Ne=new Float32Array(ie*he*te);for(let Be=0;Be<te;Be++){const Fe=Be%3*2/3-1,Je=Be>2?0:-1,ge=[Fe,Je,0,Fe+2/3,Je,0,Fe+2/3,Je+1,0,Fe,Je,0,Fe+2/3,Je+1,0,Fe,Je+1,0];Re.set(ge,de*he*Be),Ie.set(J,oe*he*Be);const Le=[Be,Be,Be,Be,Be,Be];Ne.set(Le,ie*he*Be)}const je=new nc;je.setAttribute("position",new eI(Re,de)),je.setAttribute("uv",new eI(Ie,oe)),je.setAttribute("faceIndex",new eI(Ne,ie)),l.push(je),c>Rb&&c--}return{lodPlanes:l,sizeLods:n,sigmas:t}}function KW(e,l,n){const t=new kN(e,l,n);return t.texture.mapping=dF,t.texture.name="PMREM.cubeUv",t.scissorTest=!0,t}function eU(e,l,n,t,c){e.viewport.set(l,n,t,c),e.scissor.set(l,n,t,c)}function f$(e,l,n){const t=new Float32Array(J8),c=new nt(0,1,0);return new wL({name:"SphericalGaussianBlur",defines:{n:J8,CUBEUV_TEXEL_WIDTH:1/l,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:t},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:c}},vertexShader:rV(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:VN,depthTest:!1,depthWrite:!1})}function QW(){return new wL({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:rV(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:VN,depthTest:!1,depthWrite:!1})}function $W(){return new wL({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:rV(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:VN,depthTest:!1,depthWrite:!1})}function rV(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function I$(e){let l=new WeakMap,n=null;function t(g){if(g&&g.isTexture){const U=g.mapping,_=U===c_||U===h_,Q=U===Mb||U===xb;if(_||Q)if(g.isRenderTargetTexture&&g.needsPMREMUpdate===!0){g.needsPMREMUpdate=!1;let ee=l.get(g);return n===null&&(n=new qW(e)),ee=_?n.fromEquirectangular(g,ee):n.fromCubemap(g,ee),l.set(g,ee),ee.texture}else{if(l.has(g))return l.get(g).texture;{const ee=g.image;if(_&&ee&&ee.height>0||Q&&ee&&c(ee)){n===null&&(n=new qW(e));const J=_?n.fromEquirectangular(g):n.fromCubemap(g);return l.set(g,J),g.addEventListener("dispose",y),J.texture}else return null}}}return g}function c(g){let U=0;const _=6;for(let Q=0;Q<_;Q++)g[Q]!==void 0&&U++;return U===_}function y(g){const U=g.target;U.removeEventListener("dispose",y);const _=l.get(U);_!==void 0&&(l.delete(U),_.dispose())}function A(){l=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:t,dispose:A}}function d$(e){const l={};function n(t){if(l[t]!==void 0)return l[t];let c;switch(t){case"WEBGL_depth_texture":c=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":c=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":c=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":c=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:c=e.getExtension(t)}return l[t]=c,c}return{has:function(t){return n(t)!==null},init:function(t){t.isWebGL2?(n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance")):(n("WEBGL_depth_texture"),n("OES_texture_float"),n("OES_texture_half_float"),n("OES_texture_half_float_linear"),n("OES_standard_derivatives"),n("OES_element_index_uint"),n("OES_vertex_array_object"),n("ANGLE_instanced_arrays")),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture")},get:function(t){const c=n(t);return c===null&&console.warn("THREE.WebGLRenderer: "+t+" extension not supported."),c}}}function y$(e,l,n,t){const c={},y=new WeakMap;function A(ee){const J=ee.target;J.index!==null&&l.remove(J.index);for(const he in J.attributes)l.remove(J.attributes[he]);for(const he in J.morphAttributes){const de=J.morphAttributes[he];for(let oe=0,ie=de.length;oe<ie;oe++)l.remove(de[oe])}J.removeEventListener("dispose",A),delete c[J.id];const te=y.get(J);te&&(l.remove(te),y.delete(J)),t.releaseStatesOfGeometry(J),J.isInstancedBufferGeometry===!0&&delete J._maxInstanceCount,n.memory.geometries--}function g(ee,J){return c[J.id]===!0||(J.addEventListener("dispose",A),c[J.id]=!0,n.memory.geometries++),J}function U(ee){const J=ee.attributes;for(const he in J)l.update(J[he],e.ARRAY_BUFFER);const te=ee.morphAttributes;for(const he in te){const de=te[he];for(let oe=0,ie=de.length;oe<ie;oe++)l.update(de[oe],e.ARRAY_BUFFER)}}function _(ee){const J=[],te=ee.index,he=ee.attributes.position;let de=0;if(te!==null){const Re=te.array;de=te.version;for(let Ie=0,Ne=Re.length;Ie<Ne;Ie+=3){const je=Re[Ie+0],Be=Re[Ie+1],Fe=Re[Ie+2];J.push(je,Be,Be,Fe,Fe,je)}}else if(he!==void 0){const Re=he.array;de=he.version;for(let Ie=0,Ne=Re.length/3-1;Ie<Ne;Ie+=3){const je=Ie+0,Be=Ie+1,Fe=Ie+2;J.push(je,Be,Be,Fe,Fe,je)}}else return;const oe=new(dY(J)?mY:RY)(J,1);oe.version=de;const ie=y.get(ee);ie&&l.remove(ie),y.set(ee,oe)}function Q(ee){const J=y.get(ee);if(J){const te=ee.index;te!==null&&J.version<te.version&&_(ee)}else _(ee);return y.get(ee)}return{get:g,update:U,getWireframeAttribute:Q}}function w$(e,l,n,t){const c=t.isWebGL2;let y;function A(te){y=te}let g,U;function _(te){g=te.type,U=te.bytesPerElement}function Q(te,he){e.drawElements(y,he,g,te*U),n.update(he,y,1)}function ee(te,he,de){if(de===0)return;let oe,ie;if(c)oe=e,ie="drawElementsInstanced";else if(oe=l.get("ANGLE_instanced_arrays"),ie="drawElementsInstancedANGLE",oe===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}oe[ie](y,he,g,te*U,de),n.update(he,y,de)}function J(te,he,de){if(de===0)return;const oe=l.get("WEBGL_multi_draw");if(oe===null)for(let ie=0;ie<de;ie++)this.render(te[ie]/U,he[ie]);else{oe.multiDrawElementsWEBGL(y,he,0,g,te,0,de);let ie=0;for(let Re=0;Re<de;Re++)ie+=he[Re];n.update(ie,y,1)}}this.setMode=A,this.setIndex=_,this.render=Q,this.renderInstances=ee,this.renderMultiDraw=J}function E$(e){const l={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function t(y,A,g){switch(n.calls++,A){case e.TRIANGLES:n.triangles+=g*(y/3);break;case e.LINES:n.lines+=g*(y/2);break;case e.LINE_STRIP:n.lines+=g*(y-1);break;case e.LINE_LOOP:n.lines+=g*y;break;case e.POINTS:n.points+=g*y;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",A);break}}function c(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:l,render:n,programs:null,autoReset:!0,reset:c,update:t}}function T$(e,l){return e[0]-l[0]}function p$(e,l){return Math.abs(l[1])-Math.abs(e[1])}function R$(e,l,n){const t={},c=new Float32Array(8),y=new WeakMap,A=new Gc,g=[];for(let _=0;_<8;_++)g[_]=[_,0];function U(_,Q,ee){const J=_.morphTargetInfluences;if(l.isWebGL2===!0){const te=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,he=te!==void 0?te.length:0;let de=y.get(Q);if(de===void 0||de.count!==he){let et=function(){lt.dispose(),y.delete(Q),Q.removeEventListener("dispose",et)};de!==void 0&&de.texture.dispose();const Re=Q.morphAttributes.position!==void 0,Ie=Q.morphAttributes.normal!==void 0,Ne=Q.morphAttributes.color!==void 0,je=Q.morphAttributes.position||[],Be=Q.morphAttributes.normal||[],Fe=Q.morphAttributes.color||[];let Je=0;Re===!0&&(Je=1),Ie===!0&&(Je=2),Ne===!0&&(Je=3);let ge=Q.attributes.position.count*Je,Le=1;ge>l.maxTextureSize&&(Le=Math.ceil(ge/l.maxTextureSize),ge=l.maxTextureSize);const Xe=new Float32Array(ge*Le*4*he),lt=new EY(Xe,ge,Le,he);lt.type=BN,lt.needsUpdate=!0;const ht=Je*4;for(let at=0;at<he;at++){const ft=je[at],Nt=Be[at],bt=Fe[at],Ct=ge*Le*4*at;for(let Ft=0;Ft<ft.count;Ft++){const Ht=Ft*ht;Re===!0&&(A.fromBufferAttribute(ft,Ft),Xe[Ct+Ht+0]=A.x,Xe[Ct+Ht+1]=A.y,Xe[Ct+Ht+2]=A.z,Xe[Ct+Ht+3]=0),Ie===!0&&(A.fromBufferAttribute(Nt,Ft),Xe[Ct+Ht+4]=A.x,Xe[Ct+Ht+5]=A.y,Xe[Ct+Ht+6]=A.z,Xe[Ct+Ht+7]=0),Ne===!0&&(A.fromBufferAttribute(bt,Ft),Xe[Ct+Ht+8]=A.x,Xe[Ct+Ht+9]=A.y,Xe[Ct+Ht+10]=A.z,Xe[Ct+Ht+11]=bt.itemSize===4?A.w:1)}}de={count:he,texture:lt,size:new Nl(ge,Le)},y.set(Q,de),Q.addEventListener("dispose",et)}let oe=0;for(let Re=0;Re<J.length;Re++)oe+=J[Re];const ie=Q.morphTargetsRelative?1:1-oe;ee.getUniforms().setValue(e,"morphTargetBaseInfluence",ie),ee.getUniforms().setValue(e,"morphTargetInfluences",J),ee.getUniforms().setValue(e,"morphTargetsTexture",de.texture,n),ee.getUniforms().setValue(e,"morphTargetsTextureSize",de.size)}else{const te=J===void 0?0:J.length;let he=t[Q.id];if(he===void 0||he.length!==te){he=[];for(let Ie=0;Ie<te;Ie++)he[Ie]=[Ie,0];t[Q.id]=he}for(let Ie=0;Ie<te;Ie++){const Ne=he[Ie];Ne[0]=Ie,Ne[1]=J[Ie]}he.sort(p$);for(let Ie=0;Ie<8;Ie++)Ie<te&&he[Ie][1]?(g[Ie][0]=he[Ie][0],g[Ie][1]=he[Ie][1]):(g[Ie][0]=Number.MAX_SAFE_INTEGER,g[Ie][1]=0);g.sort(T$);const de=Q.morphAttributes.position,oe=Q.morphAttributes.normal;let ie=0;for(let Ie=0;Ie<8;Ie++){const Ne=g[Ie],je=Ne[0],Be=Ne[1];je!==Number.MAX_SAFE_INTEGER&&Be?(de&&Q.getAttribute("morphTarget"+Ie)!==de[je]&&Q.setAttribute("morphTarget"+Ie,de[je]),oe&&Q.getAttribute("morphNormal"+Ie)!==oe[je]&&Q.setAttribute("morphNormal"+Ie,oe[je]),c[Ie]=Be,ie+=Be):(de&&Q.hasAttribute("morphTarget"+Ie)===!0&&Q.deleteAttribute("morphTarget"+Ie),oe&&Q.hasAttribute("morphNormal"+Ie)===!0&&Q.deleteAttribute("morphNormal"+Ie),c[Ie]=0)}const Re=Q.morphTargetsRelative?1:1-ie;ee.getUniforms().setValue(e,"morphTargetBaseInfluence",Re),ee.getUniforms().setValue(e,"morphTargetInfluences",c)}}return{update:U}}function m$(e,l,n,t){let c=new WeakMap;function y(U){const _=t.render.frame,Q=U.geometry,ee=l.get(U,Q);if(c.get(ee)!==_&&(l.update(ee),c.set(ee,_)),U.isInstancedMesh&&(U.hasEventListener("dispose",g)===!1&&U.addEventListener("dispose",g),c.get(U)!==_&&(n.update(U.instanceMatrix,e.ARRAY_BUFFER),U.instanceColor!==null&&n.update(U.instanceColor,e.ARRAY_BUFFER),c.set(U,_))),U.isSkinnedMesh){const J=U.skeleton;c.get(J)!==_&&(J.update(),c.set(J,_))}return ee}function A(){c=new WeakMap}function g(U){const _=U.target;_.removeEventListener("dispose",g),n.remove(_.instanceMatrix),_.instanceColor!==null&&n.remove(_.instanceColor)}return{update:y,dispose:A}}class OY extends D0{constructor(l,n,t,c,y,A,g,U,_,Q){if(Q=Q!==void 0?Q:eL,Q!==eL&&Q!==Hb)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");t===void 0&&Q===eL&&(t=HN),t===void 0&&Q===Hb&&(t=v8),super(null,c,y,A,g,U,Q,t,_),this.isDepthTexture=!0,this.image={width:l,height:n},this.magFilter=g!==void 0?g:Kf,this.minFilter=U!==void 0?U:Kf,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(l){return super.copy(l),this.compareFunction=l.compareFunction,this}toJSON(l){const n=super.toJSON(l);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const gY=new D0,PY=new OY(1,1);PY.compareFunction=IY;const bY=new EY,CY=new rq,MY=new AY,ZW=[],JW=[],XW=new Float32Array(16),vW=new Float32Array(9),ej=new Float32Array(4);function Zb(e,l,n){const t=e[0];if(t<=0||t>0)return e;const c=l*n;let y=ZW[c];if(y===void 0&&(y=new Float32Array(c),ZW[c]=y),l!==0){t.toArray(y,0);for(let A=1,g=0;A!==l;++A)g+=n,e[A].toArray(y,g)}return y}function lc(e,l){if(e.length!==l.length)return!1;for(let n=0,t=e.length;n<t;n++)if(e[n]!==l[n])return!1;return!0}function sc(e,l){for(let n=0,t=l.length;n<t;n++)e[n]=l[n]}function TF(e,l){let n=JW[l];n===void 0&&(n=new Int32Array(l),JW[l]=n);for(let t=0;t!==l;++t)n[t]=e.allocateTextureUnit();return n}function D$(e,l){const n=this.cache;n[0]!==l&&(e.uniform1f(this.addr,l),n[0]=l)}function N$(e,l){const n=this.cache;if(l.x!==void 0)(n[0]!==l.x||n[1]!==l.y)&&(e.uniform2f(this.addr,l.x,l.y),n[0]=l.x,n[1]=l.y);else{if(lc(n,l))return;e.uniform2fv(this.addr,l),sc(n,l)}}function A$(e,l){const n=this.cache;if(l.x!==void 0)(n[0]!==l.x||n[1]!==l.y||n[2]!==l.z)&&(e.uniform3f(this.addr,l.x,l.y,l.z),n[0]=l.x,n[1]=l.y,n[2]=l.z);else if(l.r!==void 0)(n[0]!==l.r||n[1]!==l.g||n[2]!==l.b)&&(e.uniform3f(this.addr,l.r,l.g,l.b),n[0]=l.r,n[1]=l.g,n[2]=l.b);else{if(lc(n,l))return;e.uniform3fv(this.addr,l),sc(n,l)}}function S$(e,l){const n=this.cache;if(l.x!==void 0)(n[0]!==l.x||n[1]!==l.y||n[2]!==l.z||n[3]!==l.w)&&(e.uniform4f(this.addr,l.x,l.y,l.z,l.w),n[0]=l.x,n[1]=l.y,n[2]=l.z,n[3]=l.w);else{if(lc(n,l))return;e.uniform4fv(this.addr,l),sc(n,l)}}function L$(e,l){const n=this.cache,t=l.elements;if(t===void 0){if(lc(n,l))return;e.uniformMatrix2fv(this.addr,!1,l),sc(n,l)}else{if(lc(n,t))return;ej.set(t),e.uniformMatrix2fv(this.addr,!1,ej),sc(n,t)}}function O$(e,l){const n=this.cache,t=l.elements;if(t===void 0){if(lc(n,l))return;e.uniformMatrix3fv(this.addr,!1,l),sc(n,l)}else{if(lc(n,t))return;vW.set(t),e.uniformMatrix3fv(this.addr,!1,vW),sc(n,t)}}function g$(e,l){const n=this.cache,t=l.elements;if(t===void 0){if(lc(n,l))return;e.uniformMatrix4fv(this.addr,!1,l),sc(n,l)}else{if(lc(n,t))return;XW.set(t),e.uniformMatrix4fv(this.addr,!1,XW),sc(n,t)}}function P$(e,l){const n=this.cache;n[0]!==l&&(e.uniform1i(this.addr,l),n[0]=l)}function b$(e,l){const n=this.cache;if(l.x!==void 0)(n[0]!==l.x||n[1]!==l.y)&&(e.uniform2i(this.addr,l.x,l.y),n[0]=l.x,n[1]=l.y);else{if(lc(n,l))return;e.uniform2iv(this.addr,l),sc(n,l)}}function C$(e,l){const n=this.cache;if(l.x!==void 0)(n[0]!==l.x||n[1]!==l.y||n[2]!==l.z)&&(e.uniform3i(this.addr,l.x,l.y,l.z),n[0]=l.x,n[1]=l.y,n[2]=l.z);else{if(lc(n,l))return;e.uniform3iv(this.addr,l),sc(n,l)}}function M$(e,l){const n=this.cache;if(l.x!==void 0)(n[0]!==l.x||n[1]!==l.y||n[2]!==l.z||n[3]!==l.w)&&(e.uniform4i(this.addr,l.x,l.y,l.z,l.w),n[0]=l.x,n[1]=l.y,n[2]=l.z,n[3]=l.w);else{if(lc(n,l))return;e.uniform4iv(this.addr,l),sc(n,l)}}function x$(e,l){const n=this.cache;n[0]!==l&&(e.uniform1ui(this.addr,l),n[0]=l)}function H$(e,l){const n=this.cache;if(l.x!==void 0)(n[0]!==l.x||n[1]!==l.y)&&(e.uniform2ui(this.addr,l.x,l.y),n[0]=l.x,n[1]=l.y);else{if(lc(n,l))return;e.uniform2uiv(this.addr,l),sc(n,l)}}function B$(e,l){const n=this.cache;if(l.x!==void 0)(n[0]!==l.x||n[1]!==l.y||n[2]!==l.z)&&(e.uniform3ui(this.addr,l.x,l.y,l.z),n[0]=l.x,n[1]=l.y,n[2]=l.z);else{if(lc(n,l))return;e.uniform3uiv(this.addr,l),sc(n,l)}}function U$(e,l){const n=this.cache;if(l.x!==void 0)(n[0]!==l.x||n[1]!==l.y||n[2]!==l.z||n[3]!==l.w)&&(e.uniform4ui(this.addr,l.x,l.y,l.z,l.w),n[0]=l.x,n[1]=l.y,n[2]=l.z,n[3]=l.w);else{if(lc(n,l))return;e.uniform4uiv(this.addr,l),sc(n,l)}}function F$(e,l,n){const t=this.cache,c=n.allocateTextureUnit();t[0]!==c&&(e.uniform1i(this.addr,c),t[0]=c);const y=this.type===e.SAMPLER_2D_SHADOW?PY:gY;n.setTexture2D(l||y,c)}function G$(e,l,n){const t=this.cache,c=n.allocateTextureUnit();t[0]!==c&&(e.uniform1i(this.addr,c),t[0]=c),n.setTexture3D(l||CY,c)}function _$(e,l,n){const t=this.cache,c=n.allocateTextureUnit();t[0]!==c&&(e.uniform1i(this.addr,c),t[0]=c),n.setTextureCube(l||MY,c)}function V$(e,l,n){const t=this.cache,c=n.allocateTextureUnit();t[0]!==c&&(e.uniform1i(this.addr,c),t[0]=c),n.setTexture2DArray(l||bY,c)}function W$(e){switch(e){case 5126:return D$;case 35664:return N$;case 35665:return A$;case 35666:return S$;case 35674:return L$;case 35675:return O$;case 35676:return g$;case 5124:case 35670:return P$;case 35667:case 35671:return b$;case 35668:case 35672:return C$;case 35669:case 35673:return M$;case 5125:return x$;case 36294:return H$;case 36295:return B$;case 36296:return U$;case 35678:case 36198:case 36298:case 36306:case 35682:return F$;case 35679:case 36299:case 36307:return G$;case 35680:case 36300:case 36308:case 36293:return _$;case 36289:case 36303:case 36311:case 36292:return V$}}function j$(e,l){e.uniform1fv(this.addr,l)}function Y$(e,l){const n=Zb(l,this.size,2);e.uniform2fv(this.addr,n)}function z$(e,l){const n=Zb(l,this.size,3);e.uniform3fv(this.addr,n)}function k$(e,l){const n=Zb(l,this.size,4);e.uniform4fv(this.addr,n)}function q$(e,l){const n=Zb(l,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function K$(e,l){const n=Zb(l,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Q$(e,l){const n=Zb(l,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function $$(e,l){e.uniform1iv(this.addr,l)}function Z$(e,l){e.uniform2iv(this.addr,l)}function J$(e,l){e.uniform3iv(this.addr,l)}function X$(e,l){e.uniform4iv(this.addr,l)}function v$(e,l){e.uniform1uiv(this.addr,l)}function eZ(e,l){e.uniform2uiv(this.addr,l)}function tZ(e,l){e.uniform3uiv(this.addr,l)}function nZ(e,l){e.uniform4uiv(this.addr,l)}function lZ(e,l,n){const t=this.cache,c=l.length,y=TF(n,c);lc(t,y)||(e.uniform1iv(this.addr,y),sc(t,y));for(let A=0;A!==c;++A)n.setTexture2D(l[A]||gY,y[A])}function sZ(e,l,n){const t=this.cache,c=l.length,y=TF(n,c);lc(t,y)||(e.uniform1iv(this.addr,y),sc(t,y));for(let A=0;A!==c;++A)n.setTexture3D(l[A]||CY,y[A])}function rZ(e,l,n){const t=this.cache,c=l.length,y=TF(n,c);lc(t,y)||(e.uniform1iv(this.addr,y),sc(t,y));for(let A=0;A!==c;++A)n.setTextureCube(l[A]||MY,y[A])}function uZ(e,l,n){const t=this.cache,c=l.length,y=TF(n,c);lc(t,y)||(e.uniform1iv(this.addr,y),sc(t,y));for(let A=0;A!==c;++A)n.setTexture2DArray(l[A]||bY,y[A])}function aZ(e){switch(e){case 5126:return j$;case 35664:return Y$;case 35665:return z$;case 35666:return k$;case 35674:return q$;case 35675:return K$;case 35676:return Q$;case 5124:case 35670:return $$;case 35667:case 35671:return Z$;case 35668:case 35672:return J$;case 35669:case 35673:return X$;case 5125:return v$;case 36294:return eZ;case 36295:return tZ;case 36296:return nZ;case 35678:case 36198:case 36298:case 36306:case 35682:return lZ;case 35679:case 36299:case 36307:return sZ;case 35680:case 36300:case 36308:case 36293:return rZ;case 36289:case 36303:case 36311:case 36292:return uZ}}class iZ{constructor(l,n,t){this.id=l,this.addr=t,this.cache=[],this.type=n.type,this.setValue=W$(n.type)}}class oZ{constructor(l,n,t){this.id=l,this.addr=t,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=aZ(n.type)}}class cZ{constructor(l){this.id=l,this.seq=[],this.map={}}setValue(l,n,t){const c=this.seq;for(let y=0,A=c.length;y!==A;++y){const g=c[y];g.setValue(l,n[g.id],t)}}}const WG=/(\w+)(\])?(\[|\.)?/g;function tj(e,l){e.seq.push(l),e.map[l.id]=l}function hZ(e,l,n){const t=e.name,c=t.length;for(WG.lastIndex=0;;){const y=WG.exec(t),A=WG.lastIndex;let g=y[1];const U=y[2]==="]",_=y[3];if(U&&(g=g|0),_===void 0||_==="["&&A+2===c){tj(n,_===void 0?new iZ(g,e,l):new oZ(g,e,l));break}else{let ee=n.map[g];ee===void 0&&(ee=new cZ(g),tj(n,ee)),n=ee}}}class SU{constructor(l,n){this.seq=[],this.map={};const t=l.getProgramParameter(n,l.ACTIVE_UNIFORMS);for(let c=0;c<t;++c){const y=l.getActiveUniform(n,c),A=l.getUniformLocation(n,y.name);hZ(y,A,this)}}setValue(l,n,t,c){const y=this.map[n];y!==void 0&&y.setValue(l,t,c)}setOptional(l,n,t){const c=n[t];c!==void 0&&this.setValue(l,t,c)}static upload(l,n,t,c){for(let y=0,A=n.length;y!==A;++y){const g=n[y],U=t[g.id];U.needsUpdate!==!1&&g.setValue(l,U.value,c)}}static seqWithValue(l,n){const t=[];for(let c=0,y=l.length;c!==y;++c){const A=l[c];A.id in n&&t.push(A)}return t}}function nj(e,l,n){const t=e.createShader(l);return e.shaderSource(t,n),e.compileShader(t),t}const fZ=37297;let IZ=0;function dZ(e,l){const n=e.split(`
`),t=[],c=Math.max(l-6,0),y=Math.min(l+6,n.length);for(let A=c;A<y;A++){const g=A+1;t.push(`${g===l?">":" "} ${g}: ${n[A]}`)}return t.join(`
`)}function yZ(e){const l=qs.getPrimaries(qs.workingColorSpace),n=qs.getPrimaries(e);let t;switch(l===n?t="":l===oF&&n===iF?t="LinearDisplayP3ToLinearSRGB":l===iF&&n===oF&&(t="LinearSRGBToLinearDisplayP3"),e){case tm:case yF:return[t,"LinearTransferOETF"];case Qf:case eV:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",e),[t,"LinearTransferOETF"]}}function lj(e,l,n){const t=e.getShaderParameter(l,e.COMPILE_STATUS),c=e.getShaderInfoLog(l).trim();if(t&&c==="")return"";const y=/ERROR: 0:(\d+)/.exec(c);if(y){const A=parseInt(y[1]);return n.toUpperCase()+`

`+c+`

`+dZ(e.getShaderSource(l),A)}else return c}function wZ(e,l){const n=yZ(l);return`vec4 ${e}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function EZ(e,l){let n;switch(l){case yk:n="Linear";break;case wk:n="Reinhard";break;case Ek:n="OptimizedCineon";break;case Tk:n="ACESFilmic";break;case Rk:n="AgX";break;case pk:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",l),n="Linear"}return"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}function TZ(e){return[e.extensionDerivatives||e.envMapCubeUVHeight||e.bumpMap||e.normalMapTangentSpace||e.clearcoatNormalMap||e.flatShading||e.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(e.extensionFragDepth||e.logarithmicDepthBuffer)&&e.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",e.extensionDrawBuffers&&e.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(e.extensionShaderTextureLOD||e.envMap||e.transmission)&&e.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(mb).join(`
`)}function pZ(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(mb).join(`
`)}function RZ(e){const l=[];for(const n in e){const t=e[n];t!==!1&&l.push("#define "+n+" "+t)}return l.join(`
`)}function mZ(e,l){const n={},t=e.getProgramParameter(l,e.ACTIVE_ATTRIBUTES);for(let c=0;c<t;c++){const y=e.getActiveAttrib(l,c),A=y.name;let g=1;y.type===e.FLOAT_MAT2&&(g=2),y.type===e.FLOAT_MAT3&&(g=3),y.type===e.FLOAT_MAT4&&(g=4),n[A]={type:y.type,location:e.getAttribLocation(l,A),locationSize:g}}return n}function mb(e){return e!==""}function sj(e,l){const n=l.numSpotLightShadows+l.numSpotLightMaps-l.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,l.numDirLights).replace(/NUM_SPOT_LIGHTS/g,l.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,l.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,l.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,l.numPointLights).replace(/NUM_HEMI_LIGHTS/g,l.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,l.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,l.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,l.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,l.numPointLightShadows)}function rj(e,l){return e.replace(/NUM_CLIPPING_PLANES/g,l.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,l.numClippingPlanes-l.numClipIntersection)}const DZ=/^[ \t]*#include +<([\w\d./]+)>/gm;function E_(e){return e.replace(DZ,AZ)}const NZ=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function AZ(e,l){let n=gl[l];if(n===void 0){const t=NZ.get(l);if(t!==void 0)n=gl[t],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',l,t);else throw new Error("Can not resolve #include <"+l+">")}return E_(n)}const SZ=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uj(e){return e.replace(SZ,LZ)}function LZ(e,l,n,t){let c="";for(let y=parseInt(l);y<parseInt(n);y++)c+=t.replace(/\[\s*i\s*\]/g,"[ "+y+" ]").replace(/UNROLLED_LOOP_INDEX/g,y);return c}function aj(e){let l="precision "+e.precision+` float;
precision `+e.precision+" int;";return e.precision==="highp"?l+=`
#define HIGH_PRECISION`:e.precision==="mediump"?l+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(l+=`
#define LOW_PRECISION`),l}function OZ(e){let l="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===lY?l="SHADOWMAP_TYPE_PCF":e.shadowMapType===Yz?l="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===W6&&(l="SHADOWMAP_TYPE_VSM"),l}function gZ(e){let l="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case Mb:case xb:l="ENVMAP_TYPE_CUBE";break;case dF:l="ENVMAP_TYPE_CUBE_UV";break}return l}function PZ(e){let l="ENVMAP_MODE_REFLECTION";if(e.envMap)switch(e.envMapMode){case xb:l="ENVMAP_MODE_REFRACTION";break}return l}function bZ(e){let l="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case J_:l="ENVMAP_BLENDING_MULTIPLY";break;case Ik:l="ENVMAP_BLENDING_MIX";break;case dk:l="ENVMAP_BLENDING_ADD";break}return l}function CZ(e){const l=e.envMapCubeUVHeight;if(l===null)return null;const n=Math.log2(l)-2,t=1/l;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:t,maxMip:n}}function MZ(e,l,n,t){const c=e.getContext(),y=n.defines;let A=n.vertexShader,g=n.fragmentShader;const U=OZ(n),_=gZ(n),Q=PZ(n),ee=bZ(n),J=CZ(n),te=n.isWebGL2?"":TZ(n),he=pZ(n),de=RZ(y),oe=c.createProgram();let ie,Re,Ie=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(ie=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,de].filter(mb).join(`
`),ie.length>0&&(ie+=`
`),Re=[te,"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,de].filter(mb).join(`
`),Re.length>0&&(Re+=`
`)):(ie=[aj(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,de,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+Q:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors&&n.isWebGL2?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+U:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mb).join(`
`),Re=[te,aj(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,de,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+_:"",n.envMap?"#define "+Q:"",n.envMap?"#define "+ee:"",J?"#define CUBEUV_TEXEL_WIDTH "+J.texelWidth:"",J?"#define CUBEUV_TEXEL_HEIGHT "+J.texelHeight:"",J?"#define CUBEUV_MAX_MIP "+J.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+U:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==WN?"#define TONE_MAPPING":"",n.toneMapping!==WN?gl.tonemapping_pars_fragment:"",n.toneMapping!==WN?EZ("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",gl.colorspace_pars_fragment,wZ("linearToOutputTexel",n.outputColorSpace),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(mb).join(`
`)),A=E_(A),A=sj(A,n),A=rj(A,n),g=E_(g),g=sj(g,n),g=rj(g,n),A=uj(A),g=uj(g),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(Ie=`#version 300 es
`,ie=[he,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+ie,Re=["precision mediump sampler2DArray;","#define varying in",n.glslVersion===SW?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===SW?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+Re);const Ne=Ie+ie+A,je=Ie+Re+g,Be=nj(c,c.VERTEX_SHADER,Ne),Fe=nj(c,c.FRAGMENT_SHADER,je);c.attachShader(oe,Be),c.attachShader(oe,Fe),n.index0AttributeName!==void 0?c.bindAttribLocation(oe,0,n.index0AttributeName):n.morphTargets===!0&&c.bindAttribLocation(oe,0,"position"),c.linkProgram(oe);function Je(lt){if(e.debug.checkShaderErrors){const ht=c.getProgramInfoLog(oe).trim(),et=c.getShaderInfoLog(Be).trim(),at=c.getShaderInfoLog(Fe).trim();let ft=!0,Nt=!0;if(c.getProgramParameter(oe,c.LINK_STATUS)===!1)if(ft=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(c,oe,Be,Fe);else{const bt=lj(c,Be,"vertex"),Ct=lj(c,Fe,"fragment");console.error("THREE.WebGLProgram: Shader Error "+c.getError()+" - VALIDATE_STATUS "+c.getProgramParameter(oe,c.VALIDATE_STATUS)+`

Program Info Log: `+ht+`
`+bt+`
`+Ct)}else ht!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ht):(et===""||at==="")&&(Nt=!1);Nt&&(lt.diagnostics={runnable:ft,programLog:ht,vertexShader:{log:et,prefix:ie},fragmentShader:{log:at,prefix:Re}})}c.deleteShader(Be),c.deleteShader(Fe),ge=new SU(c,oe),Le=mZ(c,oe)}let ge;this.getUniforms=function(){return ge===void 0&&Je(this),ge};let Le;this.getAttributes=function(){return Le===void 0&&Je(this),Le};let Xe=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return Xe===!1&&(Xe=c.getProgramParameter(oe,fZ)),Xe},this.destroy=function(){t.releaseStatesOfProgram(this),c.deleteProgram(oe),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=IZ++,this.cacheKey=l,this.usedTimes=1,this.program=oe,this.vertexShader=Be,this.fragmentShader=Fe,this}let xZ=0;class HZ{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(l){const n=l.vertexShader,t=l.fragmentShader,c=this._getShaderStage(n),y=this._getShaderStage(t),A=this._getShaderCacheForMaterial(l);return A.has(c)===!1&&(A.add(c),c.usedTimes++),A.has(y)===!1&&(A.add(y),y.usedTimes++),this}remove(l){const n=this.materialCache.get(l);for(const t of n)t.usedTimes--,t.usedTimes===0&&this.shaderCache.delete(t.code);return this.materialCache.delete(l),this}getVertexShaderID(l){return this._getShaderStage(l.vertexShader).id}getFragmentShaderID(l){return this._getShaderStage(l.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(l){const n=this.materialCache;let t=n.get(l);return t===void 0&&(t=new Set,n.set(l,t)),t}_getShaderStage(l){const n=this.shaderCache;let t=n.get(l);return t===void 0&&(t=new BZ(l),n.set(l,t)),t}}class BZ{constructor(l){this.id=xZ++,this.code=l,this.usedTimes=0}}function UZ(e,l,n,t,c,y,A){const g=new nV,U=new HZ,_=[],Q=c.isWebGL2,ee=c.logarithmicDepthBuffer,J=c.vertexTextures;let te=c.precision;const he={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function de(ge){return ge===0?"uv":`uv${ge}`}function oe(ge,Le,Xe,lt,ht){const et=lt.fog,at=ht.geometry,ft=ge.isMeshStandardMaterial?lt.environment:null,Nt=(ge.isMeshStandardMaterial?n:l).get(ge.envMap||ft),bt=Nt&&Nt.mapping===dF?Nt.image.height:null,Ct=he[ge.type];ge.precision!==null&&(te=c.getMaxPrecision(ge.precision),te!==ge.precision&&console.warn("THREE.WebGLProgram.getParameters:",ge.precision,"not supported, using",te,"instead."));const Ft=at.morphAttributes.position||at.morphAttributes.normal||at.morphAttributes.color,Ht=Ft!==void 0?Ft.length:0;let Ut=0;at.morphAttributes.position!==void 0&&(Ut=1),at.morphAttributes.normal!==void 0&&(Ut=2),at.morphAttributes.color!==void 0&&(Ut=3);let Lt,Bt,Xt,mn;if(Ct){const us=np[Ct];Lt=us.vertexShader,Bt=us.fragmentShader}else Lt=ge.vertexShader,Bt=ge.fragmentShader,U.update(ge),Xt=U.getVertexShaderID(ge),mn=U.getFragmentShaderID(ge);const An=e.getRenderTarget(),Un=ht.isInstancedMesh===!0,Fn=ht.isBatchedMesh===!0,yn=!!ge.map,el=!!ge.matcap,Tt=!!Nt,Xl=!!ge.aoMap,Mn=!!ge.lightMap,_n=!!ge.bumpMap,wn=!!ge.normalMap,Bl=!!ge.displacementMap,sl=!!ge.emissiveMap,Ye=!!ge.metalnessMap,We=!!ge.roughnessMap,Dt=ge.anisotropy>0,qt=ge.clearcoat>0,zt=ge.iridescence>0,Wt=ge.sheen>0,Sn=ge.transmission>0,on=Dt&&!!ge.anisotropyMap,In=qt&&!!ge.clearcoatMap,bn=qt&&!!ge.clearcoatNormalMap,Hn=qt&&!!ge.clearcoatRoughnessMap,Gt=zt&&!!ge.iridescenceMap,Rl=zt&&!!ge.iridescenceThicknessMap,$n=Wt&&!!ge.sheenColorMap,Vn=Wt&&!!ge.sheenRoughnessMap,gn=!!ge.specularMap,Tn=!!ge.specularColorMap,Zn=!!ge.specularIntensityMap,Pl=Sn&&!!ge.transmissionMap,hn=Sn&&!!ge.thicknessMap,En=!!ge.gradientMap,Jt=!!ge.alphaMap,ut=ge.alphaTest>0,Kt=!!ge.alphaHash,tn=!!ge.extensions,nn=!!at.attributes.uv1,Bn=!!at.attributes.uv2,pn=!!at.attributes.uv3;let ql=WN;return ge.toneMapped&&(An===null||An.isXRRenderTarget===!0)&&(ql=e.toneMapping),{isWebGL2:Q,shaderID:Ct,shaderType:ge.type,shaderName:ge.name,vertexShader:Lt,fragmentShader:Bt,defines:ge.defines,customVertexShaderID:Xt,customFragmentShaderID:mn,isRawShaderMaterial:ge.isRawShaderMaterial===!0,glslVersion:ge.glslVersion,precision:te,batching:Fn,instancing:Un,instancingColor:Un&&ht.instanceColor!==null,supportsVertexTextures:J,outputColorSpace:An===null?e.outputColorSpace:An.isXRRenderTarget===!0?An.texture.colorSpace:tm,map:yn,matcap:el,envMap:Tt,envMapMode:Tt&&Nt.mapping,envMapCubeUVHeight:bt,aoMap:Xl,lightMap:Mn,bumpMap:_n,normalMap:wn,displacementMap:J&&Bl,emissiveMap:sl,normalMapObjectSpace:wn&&ge.normalMapType===Mk,normalMapTangentSpace:wn&&ge.normalMapType===v_,metalnessMap:Ye,roughnessMap:We,anisotropy:Dt,anisotropyMap:on,clearcoat:qt,clearcoatMap:In,clearcoatNormalMap:bn,clearcoatRoughnessMap:Hn,iridescence:zt,iridescenceMap:Gt,iridescenceThicknessMap:Rl,sheen:Wt,sheenColorMap:$n,sheenRoughnessMap:Vn,specularMap:gn,specularColorMap:Tn,specularIntensityMap:Zn,transmission:Sn,transmissionMap:Pl,thicknessMap:hn,gradientMap:En,opaque:ge.transparent===!1&&ge.blending===Lb,alphaMap:Jt,alphaTest:ut,alphaHash:Kt,combine:ge.combine,mapUv:yn&&de(ge.map.channel),aoMapUv:Xl&&de(ge.aoMap.channel),lightMapUv:Mn&&de(ge.lightMap.channel),bumpMapUv:_n&&de(ge.bumpMap.channel),normalMapUv:wn&&de(ge.normalMap.channel),displacementMapUv:Bl&&de(ge.displacementMap.channel),emissiveMapUv:sl&&de(ge.emissiveMap.channel),metalnessMapUv:Ye&&de(ge.metalnessMap.channel),roughnessMapUv:We&&de(ge.roughnessMap.channel),anisotropyMapUv:on&&de(ge.anisotropyMap.channel),clearcoatMapUv:In&&de(ge.clearcoatMap.channel),clearcoatNormalMapUv:bn&&de(ge.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Hn&&de(ge.clearcoatRoughnessMap.channel),iridescenceMapUv:Gt&&de(ge.iridescenceMap.channel),iridescenceThicknessMapUv:Rl&&de(ge.iridescenceThicknessMap.channel),sheenColorMapUv:$n&&de(ge.sheenColorMap.channel),sheenRoughnessMapUv:Vn&&de(ge.sheenRoughnessMap.channel),specularMapUv:gn&&de(ge.specularMap.channel),specularColorMapUv:Tn&&de(ge.specularColorMap.channel),specularIntensityMapUv:Zn&&de(ge.specularIntensityMap.channel),transmissionMapUv:Pl&&de(ge.transmissionMap.channel),thicknessMapUv:hn&&de(ge.thicknessMap.channel),alphaMapUv:Jt&&de(ge.alphaMap.channel),vertexTangents:!!at.attributes.tangent&&(wn||Dt),vertexColors:ge.vertexColors,vertexAlphas:ge.vertexColors===!0&&!!at.attributes.color&&at.attributes.color.itemSize===4,vertexUv1s:nn,vertexUv2s:Bn,vertexUv3s:pn,pointsUvs:ht.isPoints===!0&&!!at.attributes.uv&&(yn||Jt),fog:!!et,useFog:ge.fog===!0,fogExp2:et&&et.isFogExp2,flatShading:ge.flatShading===!0,sizeAttenuation:ge.sizeAttenuation===!0,logarithmicDepthBuffer:ee,skinning:ht.isSkinnedMesh===!0,morphTargets:at.morphAttributes.position!==void 0,morphNormals:at.morphAttributes.normal!==void 0,morphColors:at.morphAttributes.color!==void 0,morphTargetsCount:Ht,morphTextureStride:Ut,numDirLights:Le.directional.length,numPointLights:Le.point.length,numSpotLights:Le.spot.length,numSpotLightMaps:Le.spotLightMap.length,numRectAreaLights:Le.rectArea.length,numHemiLights:Le.hemi.length,numDirLightShadows:Le.directionalShadowMap.length,numPointLightShadows:Le.pointShadowMap.length,numSpotLightShadows:Le.spotShadowMap.length,numSpotLightShadowsWithMaps:Le.numSpotLightShadowsWithMaps,numLightProbes:Le.numLightProbes,numClippingPlanes:A.numPlanes,numClipIntersection:A.numIntersection,dithering:ge.dithering,shadowMapEnabled:e.shadowMap.enabled&&Xe.length>0,shadowMapType:e.shadowMap.type,toneMapping:ql,useLegacyLights:e._useLegacyLights,decodeVideoTexture:yn&&ge.map.isVideoTexture===!0&&qs.getTransfer(ge.map.colorSpace)===yr,premultipliedAlpha:ge.premultipliedAlpha,doubleSided:ge.side===lp,flipSided:ge.side===S3,useDepthPacking:ge.depthPacking>=0,depthPacking:ge.depthPacking||0,index0AttributeName:ge.index0AttributeName,extensionDerivatives:tn&&ge.extensions.derivatives===!0,extensionFragDepth:tn&&ge.extensions.fragDepth===!0,extensionDrawBuffers:tn&&ge.extensions.drawBuffers===!0,extensionShaderTextureLOD:tn&&ge.extensions.shaderTextureLOD===!0,extensionClipCullDistance:tn&&ge.extensions.clipCullDistance&&t.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:Q||t.has("EXT_frag_depth"),rendererExtensionDrawBuffers:Q||t.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:Q||t.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:ge.customProgramCacheKey()}}function ie(ge){const Le=[];if(ge.shaderID?Le.push(ge.shaderID):(Le.push(ge.customVertexShaderID),Le.push(ge.customFragmentShaderID)),ge.defines!==void 0)for(const Xe in ge.defines)Le.push(Xe),Le.push(ge.defines[Xe]);return ge.isRawShaderMaterial===!1&&(Re(Le,ge),Ie(Le,ge),Le.push(e.outputColorSpace)),Le.push(ge.customProgramCacheKey),Le.join()}function Re(ge,Le){ge.push(Le.precision),ge.push(Le.outputColorSpace),ge.push(Le.envMapMode),ge.push(Le.envMapCubeUVHeight),ge.push(Le.mapUv),ge.push(Le.alphaMapUv),ge.push(Le.lightMapUv),ge.push(Le.aoMapUv),ge.push(Le.bumpMapUv),ge.push(Le.normalMapUv),ge.push(Le.displacementMapUv),ge.push(Le.emissiveMapUv),ge.push(Le.metalnessMapUv),ge.push(Le.roughnessMapUv),ge.push(Le.anisotropyMapUv),ge.push(Le.clearcoatMapUv),ge.push(Le.clearcoatNormalMapUv),ge.push(Le.clearcoatRoughnessMapUv),ge.push(Le.iridescenceMapUv),ge.push(Le.iridescenceThicknessMapUv),ge.push(Le.sheenColorMapUv),ge.push(Le.sheenRoughnessMapUv),ge.push(Le.specularMapUv),ge.push(Le.specularColorMapUv),ge.push(Le.specularIntensityMapUv),ge.push(Le.transmissionMapUv),ge.push(Le.thicknessMapUv),ge.push(Le.combine),ge.push(Le.fogExp2),ge.push(Le.sizeAttenuation),ge.push(Le.morphTargetsCount),ge.push(Le.morphAttributeCount),ge.push(Le.numDirLights),ge.push(Le.numPointLights),ge.push(Le.numSpotLights),ge.push(Le.numSpotLightMaps),ge.push(Le.numHemiLights),ge.push(Le.numRectAreaLights),ge.push(Le.numDirLightShadows),ge.push(Le.numPointLightShadows),ge.push(Le.numSpotLightShadows),ge.push(Le.numSpotLightShadowsWithMaps),ge.push(Le.numLightProbes),ge.push(Le.shadowMapType),ge.push(Le.toneMapping),ge.push(Le.numClippingPlanes),ge.push(Le.numClipIntersection),ge.push(Le.depthPacking)}function Ie(ge,Le){g.disableAll(),Le.isWebGL2&&g.enable(0),Le.supportsVertexTextures&&g.enable(1),Le.instancing&&g.enable(2),Le.instancingColor&&g.enable(3),Le.matcap&&g.enable(4),Le.envMap&&g.enable(5),Le.normalMapObjectSpace&&g.enable(6),Le.normalMapTangentSpace&&g.enable(7),Le.clearcoat&&g.enable(8),Le.iridescence&&g.enable(9),Le.alphaTest&&g.enable(10),Le.vertexColors&&g.enable(11),Le.vertexAlphas&&g.enable(12),Le.vertexUv1s&&g.enable(13),Le.vertexUv2s&&g.enable(14),Le.vertexUv3s&&g.enable(15),Le.vertexTangents&&g.enable(16),Le.anisotropy&&g.enable(17),Le.alphaHash&&g.enable(18),Le.batching&&g.enable(19),ge.push(g.mask),g.disableAll(),Le.fog&&g.enable(0),Le.useFog&&g.enable(1),Le.flatShading&&g.enable(2),Le.logarithmicDepthBuffer&&g.enable(3),Le.skinning&&g.enable(4),Le.morphTargets&&g.enable(5),Le.morphNormals&&g.enable(6),Le.morphColors&&g.enable(7),Le.premultipliedAlpha&&g.enable(8),Le.shadowMapEnabled&&g.enable(9),Le.useLegacyLights&&g.enable(10),Le.doubleSided&&g.enable(11),Le.flipSided&&g.enable(12),Le.useDepthPacking&&g.enable(13),Le.dithering&&g.enable(14),Le.transmission&&g.enable(15),Le.sheen&&g.enable(16),Le.opaque&&g.enable(17),Le.pointsUvs&&g.enable(18),Le.decodeVideoTexture&&g.enable(19),ge.push(g.mask)}function Ne(ge){const Le=he[ge.type];let Xe;if(Le){const lt=np[Le];Xe=Tq.clone(lt.uniforms)}else Xe=ge.uniforms;return Xe}function je(ge,Le){let Xe;for(let lt=0,ht=_.length;lt<ht;lt++){const et=_[lt];if(et.cacheKey===Le){Xe=et,++Xe.usedTimes;break}}return Xe===void 0&&(Xe=new MZ(e,Le,ge,y),_.push(Xe)),Xe}function Be(ge){if(--ge.usedTimes===0){const Le=_.indexOf(ge);_[Le]=_[_.length-1],_.pop(),ge.destroy()}}function Fe(ge){U.remove(ge)}function Je(){U.dispose()}return{getParameters:oe,getProgramCacheKey:ie,getUniforms:Ne,acquireProgram:je,releaseProgram:Be,releaseShaderCache:Fe,programs:_,dispose:Je}}function FZ(){let e=new WeakMap;function l(y){let A=e.get(y);return A===void 0&&(A={},e.set(y,A)),A}function n(y){e.delete(y)}function t(y,A,g){e.get(y)[A]=g}function c(){e=new WeakMap}return{get:l,remove:n,update:t,dispose:c}}function GZ(e,l){return e.groupOrder!==l.groupOrder?e.groupOrder-l.groupOrder:e.renderOrder!==l.renderOrder?e.renderOrder-l.renderOrder:e.material.id!==l.material.id?e.material.id-l.material.id:e.z!==l.z?e.z-l.z:e.id-l.id}function ij(e,l){return e.groupOrder!==l.groupOrder?e.groupOrder-l.groupOrder:e.renderOrder!==l.renderOrder?e.renderOrder-l.renderOrder:e.z!==l.z?l.z-e.z:e.id-l.id}function oj(){const e=[];let l=0;const n=[],t=[],c=[];function y(){l=0,n.length=0,t.length=0,c.length=0}function A(ee,J,te,he,de,oe){let ie=e[l];return ie===void 0?(ie={id:ee.id,object:ee,geometry:J,material:te,groupOrder:he,renderOrder:ee.renderOrder,z:de,group:oe},e[l]=ie):(ie.id=ee.id,ie.object=ee,ie.geometry=J,ie.material=te,ie.groupOrder=he,ie.renderOrder=ee.renderOrder,ie.z=de,ie.group=oe),l++,ie}function g(ee,J,te,he,de,oe){const ie=A(ee,J,te,he,de,oe);te.transmission>0?t.push(ie):te.transparent===!0?c.push(ie):n.push(ie)}function U(ee,J,te,he,de,oe){const ie=A(ee,J,te,he,de,oe);te.transmission>0?t.unshift(ie):te.transparent===!0?c.unshift(ie):n.unshift(ie)}function _(ee,J){n.length>1&&n.sort(ee||GZ),t.length>1&&t.sort(J||ij),c.length>1&&c.sort(J||ij)}function Q(){for(let ee=l,J=e.length;ee<J;ee++){const te=e[ee];if(te.id===null)break;te.id=null,te.object=null,te.geometry=null,te.material=null,te.group=null}}return{opaque:n,transmissive:t,transparent:c,init:y,push:g,unshift:U,finish:Q,sort:_}}function _Z(){let e=new WeakMap;function l(t,c){const y=e.get(t);let A;return y===void 0?(A=new oj,e.set(t,[A])):c>=y.length?(A=new oj,y.push(A)):A=y[c],A}function n(){e=new WeakMap}return{get:l,dispose:n}}function VZ(){const e={};return{get:function(l){if(e[l.id]!==void 0)return e[l.id];let n;switch(l.type){case"DirectionalLight":n={direction:new nt,color:new Sl};break;case"SpotLight":n={position:new nt,direction:new nt,color:new Sl,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new nt,color:new Sl,distance:0,decay:0};break;case"HemisphereLight":n={direction:new nt,skyColor:new Sl,groundColor:new Sl};break;case"RectAreaLight":n={color:new Sl,position:new nt,halfWidth:new nt,halfHeight:new nt};break}return e[l.id]=n,n}}}function WZ(){const e={};return{get:function(l){if(e[l.id]!==void 0)return e[l.id];let n;switch(l.type){case"DirectionalLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nl};break;case"SpotLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nl};break;case"PointLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nl,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[l.id]=n,n}}}let jZ=0;function YZ(e,l){return(l.castShadow?2:0)-(e.castShadow?2:0)+(l.map?1:0)-(e.map?1:0)}function zZ(e,l){const n=new VZ,t=WZ(),c={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let Q=0;Q<9;Q++)c.probe.push(new nt);const y=new nt,A=new Ll,g=new Ll;function U(Q,ee){let J=0,te=0,he=0;for(let lt=0;lt<9;lt++)c.probe[lt].set(0,0,0);let de=0,oe=0,ie=0,Re=0,Ie=0,Ne=0,je=0,Be=0,Fe=0,Je=0,ge=0;Q.sort(YZ);const Le=ee===!0?Math.PI:1;for(let lt=0,ht=Q.length;lt<ht;lt++){const et=Q[lt],at=et.color,ft=et.intensity,Nt=et.distance,bt=et.shadow&&et.shadow.map?et.shadow.map.texture:null;if(et.isAmbientLight)J+=at.r*ft*Le,te+=at.g*ft*Le,he+=at.b*ft*Le;else if(et.isLightProbe){for(let Ct=0;Ct<9;Ct++)c.probe[Ct].addScaledVector(et.sh.coefficients[Ct],ft);ge++}else if(et.isDirectionalLight){const Ct=n.get(et);if(Ct.color.copy(et.color).multiplyScalar(et.intensity*Le),et.castShadow){const Ft=et.shadow,Ht=t.get(et);Ht.shadowBias=Ft.bias,Ht.shadowNormalBias=Ft.normalBias,Ht.shadowRadius=Ft.radius,Ht.shadowMapSize=Ft.mapSize,c.directionalShadow[de]=Ht,c.directionalShadowMap[de]=bt,c.directionalShadowMatrix[de]=et.shadow.matrix,Ne++}c.directional[de]=Ct,de++}else if(et.isSpotLight){const Ct=n.get(et);Ct.position.setFromMatrixPosition(et.matrixWorld),Ct.color.copy(at).multiplyScalar(ft*Le),Ct.distance=Nt,Ct.coneCos=Math.cos(et.angle),Ct.penumbraCos=Math.cos(et.angle*(1-et.penumbra)),Ct.decay=et.decay,c.spot[ie]=Ct;const Ft=et.shadow;if(et.map&&(c.spotLightMap[Fe]=et.map,Fe++,Ft.updateMatrices(et),et.castShadow&&Je++),c.spotLightMatrix[ie]=Ft.matrix,et.castShadow){const Ht=t.get(et);Ht.shadowBias=Ft.bias,Ht.shadowNormalBias=Ft.normalBias,Ht.shadowRadius=Ft.radius,Ht.shadowMapSize=Ft.mapSize,c.spotShadow[ie]=Ht,c.spotShadowMap[ie]=bt,Be++}ie++}else if(et.isRectAreaLight){const Ct=n.get(et);Ct.color.copy(at).multiplyScalar(ft),Ct.halfWidth.set(et.width*.5,0,0),Ct.halfHeight.set(0,et.height*.5,0),c.rectArea[Re]=Ct,Re++}else if(et.isPointLight){const Ct=n.get(et);if(Ct.color.copy(et.color).multiplyScalar(et.intensity*Le),Ct.distance=et.distance,Ct.decay=et.decay,et.castShadow){const Ft=et.shadow,Ht=t.get(et);Ht.shadowBias=Ft.bias,Ht.shadowNormalBias=Ft.normalBias,Ht.shadowRadius=Ft.radius,Ht.shadowMapSize=Ft.mapSize,Ht.shadowCameraNear=Ft.camera.near,Ht.shadowCameraFar=Ft.camera.far,c.pointShadow[oe]=Ht,c.pointShadowMap[oe]=bt,c.pointShadowMatrix[oe]=et.shadow.matrix,je++}c.point[oe]=Ct,oe++}else if(et.isHemisphereLight){const Ct=n.get(et);Ct.skyColor.copy(et.color).multiplyScalar(ft*Le),Ct.groundColor.copy(et.groundColor).multiplyScalar(ft*Le),c.hemi[Ie]=Ct,Ie++}}Re>0&&(l.isWebGL2?e.has("OES_texture_float_linear")===!0?(c.rectAreaLTC1=fn.LTC_FLOAT_1,c.rectAreaLTC2=fn.LTC_FLOAT_2):(c.rectAreaLTC1=fn.LTC_HALF_1,c.rectAreaLTC2=fn.LTC_HALF_2):e.has("OES_texture_float_linear")===!0?(c.rectAreaLTC1=fn.LTC_FLOAT_1,c.rectAreaLTC2=fn.LTC_FLOAT_2):e.has("OES_texture_half_float_linear")===!0?(c.rectAreaLTC1=fn.LTC_HALF_1,c.rectAreaLTC2=fn.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),c.ambient[0]=J,c.ambient[1]=te,c.ambient[2]=he;const Xe=c.hash;(Xe.directionalLength!==de||Xe.pointLength!==oe||Xe.spotLength!==ie||Xe.rectAreaLength!==Re||Xe.hemiLength!==Ie||Xe.numDirectionalShadows!==Ne||Xe.numPointShadows!==je||Xe.numSpotShadows!==Be||Xe.numSpotMaps!==Fe||Xe.numLightProbes!==ge)&&(c.directional.length=de,c.spot.length=ie,c.rectArea.length=Re,c.point.length=oe,c.hemi.length=Ie,c.directionalShadow.length=Ne,c.directionalShadowMap.length=Ne,c.pointShadow.length=je,c.pointShadowMap.length=je,c.spotShadow.length=Be,c.spotShadowMap.length=Be,c.directionalShadowMatrix.length=Ne,c.pointShadowMatrix.length=je,c.spotLightMatrix.length=Be+Fe-Je,c.spotLightMap.length=Fe,c.numSpotLightShadowsWithMaps=Je,c.numLightProbes=ge,Xe.directionalLength=de,Xe.pointLength=oe,Xe.spotLength=ie,Xe.rectAreaLength=Re,Xe.hemiLength=Ie,Xe.numDirectionalShadows=Ne,Xe.numPointShadows=je,Xe.numSpotShadows=Be,Xe.numSpotMaps=Fe,Xe.numLightProbes=ge,c.version=jZ++)}function _(Q,ee){let J=0,te=0,he=0,de=0,oe=0;const ie=ee.matrixWorldInverse;for(let Re=0,Ie=Q.length;Re<Ie;Re++){const Ne=Q[Re];if(Ne.isDirectionalLight){const je=c.directional[J];je.direction.setFromMatrixPosition(Ne.matrixWorld),y.setFromMatrixPosition(Ne.target.matrixWorld),je.direction.sub(y),je.direction.transformDirection(ie),J++}else if(Ne.isSpotLight){const je=c.spot[he];je.position.setFromMatrixPosition(Ne.matrixWorld),je.position.applyMatrix4(ie),je.direction.setFromMatrixPosition(Ne.matrixWorld),y.setFromMatrixPosition(Ne.target.matrixWorld),je.direction.sub(y),je.direction.transformDirection(ie),he++}else if(Ne.isRectAreaLight){const je=c.rectArea[de];je.position.setFromMatrixPosition(Ne.matrixWorld),je.position.applyMatrix4(ie),g.identity(),A.copy(Ne.matrixWorld),A.premultiply(ie),g.extractRotation(A),je.halfWidth.set(Ne.width*.5,0,0),je.halfHeight.set(0,Ne.height*.5,0),je.halfWidth.applyMatrix4(g),je.halfHeight.applyMatrix4(g),de++}else if(Ne.isPointLight){const je=c.point[te];je.position.setFromMatrixPosition(Ne.matrixWorld),je.position.applyMatrix4(ie),te++}else if(Ne.isHemisphereLight){const je=c.hemi[oe];je.direction.setFromMatrixPosition(Ne.matrixWorld),je.direction.transformDirection(ie),oe++}}}return{setup:U,setupView:_,state:c}}function cj(e,l){const n=new zZ(e,l),t=[],c=[];function y(){t.length=0,c.length=0}function A(ee){t.push(ee)}function g(ee){c.push(ee)}function U(ee){n.setup(t,ee)}function _(ee){n.setupView(t,ee)}return{init:y,state:{lightsArray:t,shadowsArray:c,lights:n},setupLights:U,setupLightsView:_,pushLight:A,pushShadow:g}}function kZ(e,l){let n=new WeakMap;function t(y,A=0){const g=n.get(y);let U;return g===void 0?(U=new cj(e,l),n.set(y,[U])):A>=g.length?(U=new cj(e,l),g.push(U)):U=g[A],U}function c(){n=new WeakMap}return{get:t,dispose:c}}class qZ extends NO{constructor(l){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=bk,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(l)}copy(l){return super.copy(l),this.depthPacking=l.depthPacking,this.map=l.map,this.alphaMap=l.alphaMap,this.displacementMap=l.displacementMap,this.displacementScale=l.displacementScale,this.displacementBias=l.displacementBias,this.wireframe=l.wireframe,this.wireframeLinewidth=l.wireframeLinewidth,this}}class KZ extends NO{constructor(l){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(l)}copy(l){return super.copy(l),this.map=l.map,this.alphaMap=l.alphaMap,this.displacementMap=l.displacementMap,this.displacementScale=l.displacementScale,this.displacementBias=l.displacementBias,this}}const QZ=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$Z=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ZZ(e,l,n){let t=new lV;const c=new Nl,y=new Nl,A=new Gc,g=new qZ({depthPacking:Ck}),U=new KZ,_={},Q=n.maxTextureSize,ee={[fR]:S3,[S3]:fR,[lp]:lp},J=new wL({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Nl},radius:{value:4}},vertexShader:QZ,fragmentShader:$Z}),te=J.clone();te.defines.HORIZONTAL_PASS=1;const he=new nc;he.setAttribute("position",new eI(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const de=new w2(he,J),oe=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lY;let ie=this.type;this.render=function(Be,Fe,Je){if(oe.enabled===!1||oe.autoUpdate===!1&&oe.needsUpdate===!1||Be.length===0)return;const ge=e.getRenderTarget(),Le=e.getActiveCubeFace(),Xe=e.getActiveMipmapLevel(),lt=e.state;lt.setBlending(VN),lt.buffers.color.setClear(1,1,1,1),lt.buffers.depth.setTest(!0),lt.setScissorTest(!1);const ht=ie!==W6&&this.type===W6,et=ie===W6&&this.type!==W6;for(let at=0,ft=Be.length;at<ft;at++){const Nt=Be[at],bt=Nt.shadow;if(bt===void 0){console.warn("THREE.WebGLShadowMap:",Nt,"has no shadow.");continue}if(bt.autoUpdate===!1&&bt.needsUpdate===!1)continue;c.copy(bt.mapSize);const Ct=bt.getFrameExtents();if(c.multiply(Ct),y.copy(bt.mapSize),(c.x>Q||c.y>Q)&&(c.x>Q&&(y.x=Math.floor(Q/Ct.x),c.x=y.x*Ct.x,bt.mapSize.x=y.x),c.y>Q&&(y.y=Math.floor(Q/Ct.y),c.y=y.y*Ct.y,bt.mapSize.y=y.y)),bt.map===null||ht===!0||et===!0){const Ht=this.type!==W6?{minFilter:Kf,magFilter:Kf}:{};bt.map!==null&&bt.map.dispose(),bt.map=new kN(c.x,c.y,Ht),bt.map.texture.name=Nt.name+".shadowMap",bt.camera.updateProjectionMatrix()}e.setRenderTarget(bt.map),e.clear();const Ft=bt.getViewportCount();for(let Ht=0;Ht<Ft;Ht++){const Ut=bt.getViewport(Ht);A.set(y.x*Ut.x,y.y*Ut.y,y.x*Ut.z,y.y*Ut.w),lt.viewport(A),bt.updateMatrices(Nt,Ht),t=bt.getFrustum(),Ne(Fe,Je,bt.camera,Nt,this.type)}bt.isPointLightShadow!==!0&&this.type===W6&&Re(bt,Je),bt.needsUpdate=!1}ie=this.type,oe.needsUpdate=!1,e.setRenderTarget(ge,Le,Xe)};function Re(Be,Fe){const Je=l.update(de);J.defines.VSM_SAMPLES!==Be.blurSamples&&(J.defines.VSM_SAMPLES=Be.blurSamples,te.defines.VSM_SAMPLES=Be.blurSamples,J.needsUpdate=!0,te.needsUpdate=!0),Be.mapPass===null&&(Be.mapPass=new kN(c.x,c.y)),J.uniforms.shadow_pass.value=Be.map.texture,J.uniforms.resolution.value=Be.mapSize,J.uniforms.radius.value=Be.radius,e.setRenderTarget(Be.mapPass),e.clear(),e.renderBufferDirect(Fe,null,Je,J,de,null),te.uniforms.shadow_pass.value=Be.mapPass.texture,te.uniforms.resolution.value=Be.mapSize,te.uniforms.radius.value=Be.radius,e.setRenderTarget(Be.map),e.clear(),e.renderBufferDirect(Fe,null,Je,te,de,null)}function Ie(Be,Fe,Je,ge){let Le=null;const Xe=Je.isPointLight===!0?Be.customDistanceMaterial:Be.customDepthMaterial;if(Xe!==void 0)Le=Xe;else if(Le=Je.isPointLight===!0?U:g,e.localClippingEnabled&&Fe.clipShadows===!0&&Array.isArray(Fe.clippingPlanes)&&Fe.clippingPlanes.length!==0||Fe.displacementMap&&Fe.displacementScale!==0||Fe.alphaMap&&Fe.alphaTest>0||Fe.map&&Fe.alphaTest>0){const lt=Le.uuid,ht=Fe.uuid;let et=_[lt];et===void 0&&(et={},_[lt]=et);let at=et[ht];at===void 0&&(at=Le.clone(),et[ht]=at,Fe.addEventListener("dispose",je)),Le=at}if(Le.visible=Fe.visible,Le.wireframe=Fe.wireframe,ge===W6?Le.side=Fe.shadowSide!==null?Fe.shadowSide:Fe.side:Le.side=Fe.shadowSide!==null?Fe.shadowSide:ee[Fe.side],Le.alphaMap=Fe.alphaMap,Le.alphaTest=Fe.alphaTest,Le.map=Fe.map,Le.clipShadows=Fe.clipShadows,Le.clippingPlanes=Fe.clippingPlanes,Le.clipIntersection=Fe.clipIntersection,Le.displacementMap=Fe.displacementMap,Le.displacementScale=Fe.displacementScale,Le.displacementBias=Fe.displacementBias,Le.wireframeLinewidth=Fe.wireframeLinewidth,Le.linewidth=Fe.linewidth,Je.isPointLight===!0&&Le.isMeshDistanceMaterial===!0){const lt=e.properties.get(Le);lt.light=Je}return Le}function Ne(Be,Fe,Je,ge,Le){if(Be.visible===!1)return;if(Be.layers.test(Fe.layers)&&(Be.isMesh||Be.isLine||Be.isPoints)&&(Be.castShadow||Be.receiveShadow&&Le===W6)&&(!Be.frustumCulled||t.intersectsObject(Be))){Be.modelViewMatrix.multiplyMatrices(Je.matrixWorldInverse,Be.matrixWorld);const ht=l.update(Be),et=Be.material;if(Array.isArray(et)){const at=ht.groups;for(let ft=0,Nt=at.length;ft<Nt;ft++){const bt=at[ft],Ct=et[bt.materialIndex];if(Ct&&Ct.visible){const Ft=Ie(Be,Ct,ge,Le);Be.onBeforeShadow(e,Be,Fe,Je,ht,Ft,bt),e.renderBufferDirect(Je,null,ht,Ft,Be,bt),Be.onAfterShadow(e,Be,Fe,Je,ht,Ft,bt)}}}else if(et.visible){const at=Ie(Be,et,ge,Le);Be.onBeforeShadow(e,Be,Fe,Je,ht,at,null),e.renderBufferDirect(Je,null,ht,at,Be,null),Be.onAfterShadow(e,Be,Fe,Je,ht,at,null)}}const lt=Be.children;for(let ht=0,et=lt.length;ht<et;ht++)Ne(lt[ht],Fe,Je,ge,Le)}function je(Be){Be.target.removeEventListener("dispose",je);for(const Je in _){const ge=_[Je],Le=Be.target.uuid;Le in ge&&(ge[Le].dispose(),delete ge[Le])}}}function JZ(e,l,n){const t=n.isWebGL2;function c(){let ut=!1;const Kt=new Gc;let tn=null;const nn=new Gc(0,0,0,0);return{setMask:function(Bn){tn!==Bn&&!ut&&(e.colorMask(Bn,Bn,Bn,Bn),tn=Bn)},setLocked:function(Bn){ut=Bn},setClear:function(Bn,pn,ql,Ms,us){us===!0&&(Bn*=Ms,pn*=Ms,ql*=Ms),Kt.set(Bn,pn,ql,Ms),nn.equals(Kt)===!1&&(e.clearColor(Bn,pn,ql,Ms),nn.copy(Kt))},reset:function(){ut=!1,tn=null,nn.set(-1,0,0,0)}}}function y(){let ut=!1,Kt=null,tn=null,nn=null;return{setTest:function(Bn){Bn?Fn(e.DEPTH_TEST):yn(e.DEPTH_TEST)},setMask:function(Bn){Kt!==Bn&&!ut&&(e.depthMask(Bn),Kt=Bn)},setFunc:function(Bn){if(tn!==Bn){switch(Bn){case uk:e.depthFunc(e.NEVER);break;case ak:e.depthFunc(e.ALWAYS);break;case ik:e.depthFunc(e.LESS);break;case uF:e.depthFunc(e.LEQUAL);break;case ok:e.depthFunc(e.EQUAL);break;case ck:e.depthFunc(e.GEQUAL);break;case hk:e.depthFunc(e.GREATER);break;case fk:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}tn=Bn}},setLocked:function(Bn){ut=Bn},setClear:function(Bn){nn!==Bn&&(e.clearDepth(Bn),nn=Bn)},reset:function(){ut=!1,Kt=null,tn=null,nn=null}}}function A(){let ut=!1,Kt=null,tn=null,nn=null,Bn=null,pn=null,ql=null,Ms=null,us=null;return{setTest:function(bl){ut||(bl?Fn(e.STENCIL_TEST):yn(e.STENCIL_TEST))},setMask:function(bl){Kt!==bl&&!ut&&(e.stencilMask(bl),Kt=bl)},setFunc:function(bl,Es,Su){(tn!==bl||nn!==Es||Bn!==Su)&&(e.stencilFunc(bl,Es,Su),tn=bl,nn=Es,Bn=Su)},setOp:function(bl,Es,Su){(pn!==bl||ql!==Es||Ms!==Su)&&(e.stencilOp(bl,Es,Su),pn=bl,ql=Es,Ms=Su)},setLocked:function(bl){ut=bl},setClear:function(bl){us!==bl&&(e.clearStencil(bl),us=bl)},reset:function(){ut=!1,Kt=null,tn=null,nn=null,Bn=null,pn=null,ql=null,Ms=null,us=null}}}const g=new c,U=new y,_=new A,Q=new WeakMap,ee=new WeakMap;let J={},te={},he=new WeakMap,de=[],oe=null,ie=!1,Re=null,Ie=null,Ne=null,je=null,Be=null,Fe=null,Je=null,ge=new Sl(0,0,0),Le=0,Xe=!1,lt=null,ht=null,et=null,at=null,ft=null;const Nt=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let bt=!1,Ct=0;const Ft=e.getParameter(e.VERSION);Ft.indexOf("WebGL")!==-1?(Ct=parseFloat(/^WebGL (\d)/.exec(Ft)[1]),bt=Ct>=1):Ft.indexOf("OpenGL ES")!==-1&&(Ct=parseFloat(/^OpenGL ES (\d)/.exec(Ft)[1]),bt=Ct>=2);let Ht=null,Ut={};const Lt=e.getParameter(e.SCISSOR_BOX),Bt=e.getParameter(e.VIEWPORT),Xt=new Gc().fromArray(Lt),mn=new Gc().fromArray(Bt);function An(ut,Kt,tn,nn){const Bn=new Uint8Array(4),pn=e.createTexture();e.bindTexture(ut,pn),e.texParameteri(ut,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(ut,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let ql=0;ql<tn;ql++)t&&(ut===e.TEXTURE_3D||ut===e.TEXTURE_2D_ARRAY)?e.texImage3D(Kt,0,e.RGBA,1,1,nn,0,e.RGBA,e.UNSIGNED_BYTE,Bn):e.texImage2D(Kt+ql,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,Bn);return pn}const Un={};Un[e.TEXTURE_2D]=An(e.TEXTURE_2D,e.TEXTURE_2D,1),Un[e.TEXTURE_CUBE_MAP]=An(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),t&&(Un[e.TEXTURE_2D_ARRAY]=An(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Un[e.TEXTURE_3D]=An(e.TEXTURE_3D,e.TEXTURE_3D,1,1)),g.setClear(0,0,0,1),U.setClear(1),_.setClear(0),Fn(e.DEPTH_TEST),U.setFunc(uF),sl(!1),Ye(qV),Fn(e.CULL_FACE),wn(VN);function Fn(ut){J[ut]!==!0&&(e.enable(ut),J[ut]=!0)}function yn(ut){J[ut]!==!1&&(e.disable(ut),J[ut]=!1)}function el(ut,Kt){return te[ut]!==Kt?(e.bindFramebuffer(ut,Kt),te[ut]=Kt,t&&(ut===e.DRAW_FRAMEBUFFER&&(te[e.FRAMEBUFFER]=Kt),ut===e.FRAMEBUFFER&&(te[e.DRAW_FRAMEBUFFER]=Kt)),!0):!1}function Tt(ut,Kt){let tn=de,nn=!1;if(ut)if(tn=he.get(Kt),tn===void 0&&(tn=[],he.set(Kt,tn)),ut.isWebGLMultipleRenderTargets){const Bn=ut.texture;if(tn.length!==Bn.length||tn[0]!==e.COLOR_ATTACHMENT0){for(let pn=0,ql=Bn.length;pn<ql;pn++)tn[pn]=e.COLOR_ATTACHMENT0+pn;tn.length=Bn.length,nn=!0}}else tn[0]!==e.COLOR_ATTACHMENT0&&(tn[0]=e.COLOR_ATTACHMENT0,nn=!0);else tn[0]!==e.BACK&&(tn[0]=e.BACK,nn=!0);nn&&(n.isWebGL2?e.drawBuffers(tn):l.get("WEBGL_draw_buffers").drawBuffersWEBGL(tn))}function Xl(ut){return oe!==ut?(e.useProgram(ut),oe=ut,!0):!1}const Mn={[Z8]:e.FUNC_ADD,[kz]:e.FUNC_SUBTRACT,[qz]:e.FUNC_REVERSE_SUBTRACT};if(t)Mn[ZV]=e.MIN,Mn[JV]=e.MAX;else{const ut=l.get("EXT_blend_minmax");ut!==null&&(Mn[ZV]=ut.MIN_EXT,Mn[JV]=ut.MAX_EXT)}const _n={[Kz]:e.ZERO,[Qz]:e.ONE,[$z]:e.SRC_COLOR,[i_]:e.SRC_ALPHA,[tk]:e.SRC_ALPHA_SATURATE,[vz]:e.DST_COLOR,[Jz]:e.DST_ALPHA,[Zz]:e.ONE_MINUS_SRC_COLOR,[o_]:e.ONE_MINUS_SRC_ALPHA,[ek]:e.ONE_MINUS_DST_COLOR,[Xz]:e.ONE_MINUS_DST_ALPHA,[nk]:e.CONSTANT_COLOR,[lk]:e.ONE_MINUS_CONSTANT_COLOR,[sk]:e.CONSTANT_ALPHA,[rk]:e.ONE_MINUS_CONSTANT_ALPHA};function wn(ut,Kt,tn,nn,Bn,pn,ql,Ms,us,bl){if(ut===VN){ie===!0&&(yn(e.BLEND),ie=!1);return}if(ie===!1&&(Fn(e.BLEND),ie=!0),ut!==zz){if(ut!==Re||bl!==Xe){if((Ie!==Z8||Be!==Z8)&&(e.blendEquation(e.FUNC_ADD),Ie=Z8,Be=Z8),bl)switch(ut){case Lb:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case KV:e.blendFunc(e.ONE,e.ONE);break;case QV:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case $V:e.blendFuncSeparate(e.ZERO,e.SRC_COLOR,e.ZERO,e.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",ut);break}else switch(ut){case Lb:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case KV:e.blendFunc(e.SRC_ALPHA,e.ONE);break;case QV:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case $V:e.blendFunc(e.ZERO,e.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",ut);break}Ne=null,je=null,Fe=null,Je=null,ge.set(0,0,0),Le=0,Re=ut,Xe=bl}return}Bn=Bn||Kt,pn=pn||tn,ql=ql||nn,(Kt!==Ie||Bn!==Be)&&(e.blendEquationSeparate(Mn[Kt],Mn[Bn]),Ie=Kt,Be=Bn),(tn!==Ne||nn!==je||pn!==Fe||ql!==Je)&&(e.blendFuncSeparate(_n[tn],_n[nn],_n[pn],_n[ql]),Ne=tn,je=nn,Fe=pn,Je=ql),(Ms.equals(ge)===!1||us!==Le)&&(e.blendColor(Ms.r,Ms.g,Ms.b,us),ge.copy(Ms),Le=us),Re=ut,Xe=!1}function Bl(ut,Kt){ut.side===lp?yn(e.CULL_FACE):Fn(e.CULL_FACE);let tn=ut.side===S3;Kt&&(tn=!tn),sl(tn),ut.blending===Lb&&ut.transparent===!1?wn(VN):wn(ut.blending,ut.blendEquation,ut.blendSrc,ut.blendDst,ut.blendEquationAlpha,ut.blendSrcAlpha,ut.blendDstAlpha,ut.blendColor,ut.blendAlpha,ut.premultipliedAlpha),U.setFunc(ut.depthFunc),U.setTest(ut.depthTest),U.setMask(ut.depthWrite),g.setMask(ut.colorWrite);const nn=ut.stencilWrite;_.setTest(nn),nn&&(_.setMask(ut.stencilWriteMask),_.setFunc(ut.stencilFunc,ut.stencilRef,ut.stencilFuncMask),_.setOp(ut.stencilFail,ut.stencilZFail,ut.stencilZPass)),Dt(ut.polygonOffset,ut.polygonOffsetFactor,ut.polygonOffsetUnits),ut.alphaToCoverage===!0?Fn(e.SAMPLE_ALPHA_TO_COVERAGE):yn(e.SAMPLE_ALPHA_TO_COVERAGE)}function sl(ut){lt!==ut&&(ut?e.frontFace(e.CW):e.frontFace(e.CCW),lt=ut)}function Ye(ut){ut!==Wz?(Fn(e.CULL_FACE),ut!==ht&&(ut===qV?e.cullFace(e.BACK):ut===jz?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):yn(e.CULL_FACE),ht=ut}function We(ut){ut!==et&&(bt&&e.lineWidth(ut),et=ut)}function Dt(ut,Kt,tn){ut?(Fn(e.POLYGON_OFFSET_FILL),(at!==Kt||ft!==tn)&&(e.polygonOffset(Kt,tn),at=Kt,ft=tn)):yn(e.POLYGON_OFFSET_FILL)}function qt(ut){ut?Fn(e.SCISSOR_TEST):yn(e.SCISSOR_TEST)}function zt(ut){ut===void 0&&(ut=e.TEXTURE0+Nt-1),Ht!==ut&&(e.activeTexture(ut),Ht=ut)}function Wt(ut,Kt,tn){tn===void 0&&(Ht===null?tn=e.TEXTURE0+Nt-1:tn=Ht);let nn=Ut[tn];nn===void 0&&(nn={type:void 0,texture:void 0},Ut[tn]=nn),(nn.type!==ut||nn.texture!==Kt)&&(Ht!==tn&&(e.activeTexture(tn),Ht=tn),e.bindTexture(ut,Kt||Un[ut]),nn.type=ut,nn.texture=Kt)}function Sn(){const ut=Ut[Ht];ut!==void 0&&ut.type!==void 0&&(e.bindTexture(ut.type,null),ut.type=void 0,ut.texture=void 0)}function on(){try{e.compressedTexImage2D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function In(){try{e.compressedTexImage3D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function bn(){try{e.texSubImage2D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function Hn(){try{e.texSubImage3D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function Gt(){try{e.compressedTexSubImage2D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function Rl(){try{e.compressedTexSubImage3D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function $n(){try{e.texStorage2D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function Vn(){try{e.texStorage3D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function gn(){try{e.texImage2D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function Tn(){try{e.texImage3D.apply(e,arguments)}catch(ut){console.error("THREE.WebGLState:",ut)}}function Zn(ut){Xt.equals(ut)===!1&&(e.scissor(ut.x,ut.y,ut.z,ut.w),Xt.copy(ut))}function Pl(ut){mn.equals(ut)===!1&&(e.viewport(ut.x,ut.y,ut.z,ut.w),mn.copy(ut))}function hn(ut,Kt){let tn=ee.get(Kt);tn===void 0&&(tn=new WeakMap,ee.set(Kt,tn));let nn=tn.get(ut);nn===void 0&&(nn=e.getUniformBlockIndex(Kt,ut.name),tn.set(ut,nn))}function En(ut,Kt){const nn=ee.get(Kt).get(ut);Q.get(Kt)!==nn&&(e.uniformBlockBinding(Kt,nn,ut.__bindingPointIndex),Q.set(Kt,nn))}function Jt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),t===!0&&(e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null)),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),J={},Ht=null,Ut={},te={},he=new WeakMap,de=[],oe=null,ie=!1,Re=null,Ie=null,Ne=null,je=null,Be=null,Fe=null,Je=null,ge=new Sl(0,0,0),Le=0,Xe=!1,lt=null,ht=null,et=null,at=null,ft=null,Xt.set(0,0,e.canvas.width,e.canvas.height),mn.set(0,0,e.canvas.width,e.canvas.height),g.reset(),U.reset(),_.reset()}return{buffers:{color:g,depth:U,stencil:_},enable:Fn,disable:yn,bindFramebuffer:el,drawBuffers:Tt,useProgram:Xl,setBlending:wn,setMaterial:Bl,setFlipSided:sl,setCullFace:Ye,setLineWidth:We,setPolygonOffset:Dt,setScissorTest:qt,activeTexture:zt,bindTexture:Wt,unbindTexture:Sn,compressedTexImage2D:on,compressedTexImage3D:In,texImage2D:gn,texImage3D:Tn,updateUBOMapping:hn,uniformBlockBinding:En,texStorage2D:$n,texStorage3D:Vn,texSubImage2D:bn,texSubImage3D:Hn,compressedTexSubImage2D:Gt,compressedTexSubImage3D:Rl,scissor:Zn,viewport:Pl,reset:Jt}}function XZ(e,l,n,t,c,y,A){const g=c.isWebGL2,U=l.has("WEBGL_multisampled_render_to_texture")?l.get("WEBGL_multisampled_render_to_texture"):null,_=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),Q=new WeakMap;let ee;const J=new WeakMap;let te=!1;try{te=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function he(Ye,We){return te?new OffscreenCanvas(Ye,We):fF("canvas")}function de(Ye,We,Dt,qt){let zt=1;if((Ye.width>qt||Ye.height>qt)&&(zt=qt/Math.max(Ye.width,Ye.height)),zt<1||We===!0)if(typeof HTMLImageElement<"u"&&Ye instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&Ye instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&Ye instanceof ImageBitmap){const Wt=We?hF:Math.floor,Sn=Wt(zt*Ye.width),on=Wt(zt*Ye.height);ee===void 0&&(ee=he(Sn,on));const In=Dt?he(Sn,on):ee;return In.width=Sn,In.height=on,In.getContext("2d").drawImage(Ye,0,0,Sn,on),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Ye.width+"x"+Ye.height+") to ("+Sn+"x"+on+")."),In}else return"data"in Ye&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Ye.width+"x"+Ye.height+")."),Ye;return Ye}function oe(Ye){return w_(Ye.width)&&w_(Ye.height)}function ie(Ye){return g?!1:Ye.wrapS!==uE||Ye.wrapT!==uE||Ye.minFilter!==Kf&&Ye.minFilter!==d2}function Re(Ye,We){return Ye.generateMipmaps&&We&&Ye.minFilter!==Kf&&Ye.minFilter!==d2}function Ie(Ye){e.generateMipmap(Ye)}function Ne(Ye,We,Dt,qt,zt=!1){if(g===!1)return We;if(Ye!==null){if(e[Ye]!==void 0)return e[Ye];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+Ye+"'")}let Wt=We;if(We===e.RED&&(Dt===e.FLOAT&&(Wt=e.R32F),Dt===e.HALF_FLOAT&&(Wt=e.R16F),Dt===e.UNSIGNED_BYTE&&(Wt=e.R8)),We===e.RED_INTEGER&&(Dt===e.UNSIGNED_BYTE&&(Wt=e.R8UI),Dt===e.UNSIGNED_SHORT&&(Wt=e.R16UI),Dt===e.UNSIGNED_INT&&(Wt=e.R32UI),Dt===e.BYTE&&(Wt=e.R8I),Dt===e.SHORT&&(Wt=e.R16I),Dt===e.INT&&(Wt=e.R32I)),We===e.RG&&(Dt===e.FLOAT&&(Wt=e.RG32F),Dt===e.HALF_FLOAT&&(Wt=e.RG16F),Dt===e.UNSIGNED_BYTE&&(Wt=e.RG8)),We===e.RGBA){const Sn=zt?aF:qs.getTransfer(qt);Dt===e.FLOAT&&(Wt=e.RGBA32F),Dt===e.HALF_FLOAT&&(Wt=e.RGBA16F),Dt===e.UNSIGNED_BYTE&&(Wt=Sn===yr?e.SRGB8_ALPHA8:e.RGBA8),Dt===e.UNSIGNED_SHORT_4_4_4_4&&(Wt=e.RGBA4),Dt===e.UNSIGNED_SHORT_5_5_5_1&&(Wt=e.RGB5_A1)}return(Wt===e.R16F||Wt===e.R32F||Wt===e.RG16F||Wt===e.RG32F||Wt===e.RGBA16F||Wt===e.RGBA32F)&&l.get("EXT_color_buffer_float"),Wt}function je(Ye,We,Dt){return Re(Ye,Dt)===!0||Ye.isFramebufferTexture&&Ye.minFilter!==Kf&&Ye.minFilter!==d2?Math.log2(Math.max(We.width,We.height))+1:Ye.mipmaps!==void 0&&Ye.mipmaps.length>0?Ye.mipmaps.length:Ye.isCompressedTexture&&Array.isArray(Ye.image)?We.mipmaps.length:1}function Be(Ye){return Ye===Kf||Ye===XV||Ye===dG?e.NEAREST:e.LINEAR}function Fe(Ye){const We=Ye.target;We.removeEventListener("dispose",Fe),ge(We),We.isVideoTexture&&Q.delete(We)}function Je(Ye){const We=Ye.target;We.removeEventListener("dispose",Je),Xe(We)}function ge(Ye){const We=t.get(Ye);if(We.__webglInit===void 0)return;const Dt=Ye.source,qt=J.get(Dt);if(qt){const zt=qt[We.__cacheKey];zt.usedTimes--,zt.usedTimes===0&&Le(Ye),Object.keys(qt).length===0&&J.delete(Dt)}t.remove(Ye)}function Le(Ye){const We=t.get(Ye);e.deleteTexture(We.__webglTexture);const Dt=Ye.source,qt=J.get(Dt);delete qt[We.__cacheKey],A.memory.textures--}function Xe(Ye){const We=Ye.texture,Dt=t.get(Ye),qt=t.get(We);if(qt.__webglTexture!==void 0&&(e.deleteTexture(qt.__webglTexture),A.memory.textures--),Ye.depthTexture&&Ye.depthTexture.dispose(),Ye.isWebGLCubeRenderTarget)for(let zt=0;zt<6;zt++){if(Array.isArray(Dt.__webglFramebuffer[zt]))for(let Wt=0;Wt<Dt.__webglFramebuffer[zt].length;Wt++)e.deleteFramebuffer(Dt.__webglFramebuffer[zt][Wt]);else e.deleteFramebuffer(Dt.__webglFramebuffer[zt]);Dt.__webglDepthbuffer&&e.deleteRenderbuffer(Dt.__webglDepthbuffer[zt])}else{if(Array.isArray(Dt.__webglFramebuffer))for(let zt=0;zt<Dt.__webglFramebuffer.length;zt++)e.deleteFramebuffer(Dt.__webglFramebuffer[zt]);else e.deleteFramebuffer(Dt.__webglFramebuffer);if(Dt.__webglDepthbuffer&&e.deleteRenderbuffer(Dt.__webglDepthbuffer),Dt.__webglMultisampledFramebuffer&&e.deleteFramebuffer(Dt.__webglMultisampledFramebuffer),Dt.__webglColorRenderbuffer)for(let zt=0;zt<Dt.__webglColorRenderbuffer.length;zt++)Dt.__webglColorRenderbuffer[zt]&&e.deleteRenderbuffer(Dt.__webglColorRenderbuffer[zt]);Dt.__webglDepthRenderbuffer&&e.deleteRenderbuffer(Dt.__webglDepthRenderbuffer)}if(Ye.isWebGLMultipleRenderTargets)for(let zt=0,Wt=We.length;zt<Wt;zt++){const Sn=t.get(We[zt]);Sn.__webglTexture&&(e.deleteTexture(Sn.__webglTexture),A.memory.textures--),t.remove(We[zt])}t.remove(We),t.remove(Ye)}let lt=0;function ht(){lt=0}function et(){const Ye=lt;return Ye>=c.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+Ye+" texture units while this GPU supports only "+c.maxTextures),lt+=1,Ye}function at(Ye){const We=[];return We.push(Ye.wrapS),We.push(Ye.wrapT),We.push(Ye.wrapR||0),We.push(Ye.magFilter),We.push(Ye.minFilter),We.push(Ye.anisotropy),We.push(Ye.internalFormat),We.push(Ye.format),We.push(Ye.type),We.push(Ye.generateMipmaps),We.push(Ye.premultiplyAlpha),We.push(Ye.flipY),We.push(Ye.unpackAlignment),We.push(Ye.colorSpace),We.join()}function ft(Ye,We){const Dt=t.get(Ye);if(Ye.isVideoTexture&&Bl(Ye),Ye.isRenderTargetTexture===!1&&Ye.version>0&&Dt.__version!==Ye.version){const qt=Ye.image;if(qt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(qt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Xt(Dt,Ye,We);return}}n.bindTexture(e.TEXTURE_2D,Dt.__webglTexture,e.TEXTURE0+We)}function Nt(Ye,We){const Dt=t.get(Ye);if(Ye.version>0&&Dt.__version!==Ye.version){Xt(Dt,Ye,We);return}n.bindTexture(e.TEXTURE_2D_ARRAY,Dt.__webglTexture,e.TEXTURE0+We)}function bt(Ye,We){const Dt=t.get(Ye);if(Ye.version>0&&Dt.__version!==Ye.version){Xt(Dt,Ye,We);return}n.bindTexture(e.TEXTURE_3D,Dt.__webglTexture,e.TEXTURE0+We)}function Ct(Ye,We){const Dt=t.get(Ye);if(Ye.version>0&&Dt.__version!==Ye.version){mn(Dt,Ye,We);return}n.bindTexture(e.TEXTURE_CUBE_MAP,Dt.__webglTexture,e.TEXTURE0+We)}const Ft={[f_]:e.REPEAT,[uE]:e.CLAMP_TO_EDGE,[I_]:e.MIRRORED_REPEAT},Ht={[Kf]:e.NEAREST,[XV]:e.NEAREST_MIPMAP_NEAREST,[dG]:e.NEAREST_MIPMAP_LINEAR,[d2]:e.LINEAR,[mk]:e.LINEAR_MIPMAP_NEAREST,[ZH]:e.LINEAR_MIPMAP_LINEAR},Ut={[xk]:e.NEVER,[_k]:e.ALWAYS,[Hk]:e.LESS,[IY]:e.LEQUAL,[Bk]:e.EQUAL,[Gk]:e.GEQUAL,[Uk]:e.GREATER,[Fk]:e.NOTEQUAL};function Lt(Ye,We,Dt){if(Dt?(e.texParameteri(Ye,e.TEXTURE_WRAP_S,Ft[We.wrapS]),e.texParameteri(Ye,e.TEXTURE_WRAP_T,Ft[We.wrapT]),(Ye===e.TEXTURE_3D||Ye===e.TEXTURE_2D_ARRAY)&&e.texParameteri(Ye,e.TEXTURE_WRAP_R,Ft[We.wrapR]),e.texParameteri(Ye,e.TEXTURE_MAG_FILTER,Ht[We.magFilter]),e.texParameteri(Ye,e.TEXTURE_MIN_FILTER,Ht[We.minFilter])):(e.texParameteri(Ye,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(Ye,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),(Ye===e.TEXTURE_3D||Ye===e.TEXTURE_2D_ARRAY)&&e.texParameteri(Ye,e.TEXTURE_WRAP_R,e.CLAMP_TO_EDGE),(We.wrapS!==uE||We.wrapT!==uE)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),e.texParameteri(Ye,e.TEXTURE_MAG_FILTER,Be(We.magFilter)),e.texParameteri(Ye,e.TEXTURE_MIN_FILTER,Be(We.minFilter)),We.minFilter!==Kf&&We.minFilter!==d2&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),We.compareFunction&&(e.texParameteri(Ye,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(Ye,e.TEXTURE_COMPARE_FUNC,Ut[We.compareFunction])),l.has("EXT_texture_filter_anisotropic")===!0){const qt=l.get("EXT_texture_filter_anisotropic");if(We.magFilter===Kf||We.minFilter!==dG&&We.minFilter!==ZH||We.type===BN&&l.has("OES_texture_float_linear")===!1||g===!1&&We.type===JH&&l.has("OES_texture_half_float_linear")===!1)return;(We.anisotropy>1||t.get(We).__currentAnisotropy)&&(e.texParameterf(Ye,qt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(We.anisotropy,c.getMaxAnisotropy())),t.get(We).__currentAnisotropy=We.anisotropy)}}function Bt(Ye,We){let Dt=!1;Ye.__webglInit===void 0&&(Ye.__webglInit=!0,We.addEventListener("dispose",Fe));const qt=We.source;let zt=J.get(qt);zt===void 0&&(zt={},J.set(qt,zt));const Wt=at(We);if(Wt!==Ye.__cacheKey){zt[Wt]===void 0&&(zt[Wt]={texture:e.createTexture(),usedTimes:0},A.memory.textures++,Dt=!0),zt[Wt].usedTimes++;const Sn=zt[Ye.__cacheKey];Sn!==void 0&&(zt[Ye.__cacheKey].usedTimes--,Sn.usedTimes===0&&Le(We)),Ye.__cacheKey=Wt,Ye.__webglTexture=zt[Wt].texture}return Dt}function Xt(Ye,We,Dt){let qt=e.TEXTURE_2D;(We.isDataArrayTexture||We.isCompressedArrayTexture)&&(qt=e.TEXTURE_2D_ARRAY),We.isData3DTexture&&(qt=e.TEXTURE_3D);const zt=Bt(Ye,We),Wt=We.source;n.bindTexture(qt,Ye.__webglTexture,e.TEXTURE0+Dt);const Sn=t.get(Wt);if(Wt.version!==Sn.__version||zt===!0){n.activeTexture(e.TEXTURE0+Dt);const on=qs.getPrimaries(qs.workingColorSpace),In=We.colorSpace===y2?null:qs.getPrimaries(We.colorSpace),bn=We.colorSpace===y2||on===In?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,We.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,We.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,We.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,bn);const Hn=ie(We)&&oe(We.image)===!1;let Gt=de(We.image,Hn,!1,c.maxTextureSize);Gt=sl(We,Gt);const Rl=oe(Gt)||g,$n=y.convert(We.format,We.colorSpace);let Vn=y.convert(We.type),gn=Ne(We.internalFormat,$n,Vn,We.colorSpace,We.isVideoTexture);Lt(qt,We,Rl);let Tn;const Zn=We.mipmaps,Pl=g&&We.isVideoTexture!==!0&&gn!==hY,hn=Sn.__version===void 0||zt===!0,En=je(We,Gt,Rl);if(We.isDepthTexture)gn=e.DEPTH_COMPONENT,g?We.type===BN?gn=e.DEPTH_COMPONENT32F:We.type===HN?gn=e.DEPTH_COMPONENT24:We.type===v8?gn=e.DEPTH24_STENCIL8:gn=e.DEPTH_COMPONENT16:We.type===BN&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),We.format===eL&&gn===e.DEPTH_COMPONENT&&We.type!==X_&&We.type!==HN&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),We.type=HN,Vn=y.convert(We.type)),We.format===Hb&&gn===e.DEPTH_COMPONENT&&(gn=e.DEPTH_STENCIL,We.type!==v8&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),We.type=v8,Vn=y.convert(We.type))),hn&&(Pl?n.texStorage2D(e.TEXTURE_2D,1,gn,Gt.width,Gt.height):n.texImage2D(e.TEXTURE_2D,0,gn,Gt.width,Gt.height,0,$n,Vn,null));else if(We.isDataTexture)if(Zn.length>0&&Rl){Pl&&hn&&n.texStorage2D(e.TEXTURE_2D,En,gn,Zn[0].width,Zn[0].height);for(let Jt=0,ut=Zn.length;Jt<ut;Jt++)Tn=Zn[Jt],Pl?n.texSubImage2D(e.TEXTURE_2D,Jt,0,0,Tn.width,Tn.height,$n,Vn,Tn.data):n.texImage2D(e.TEXTURE_2D,Jt,gn,Tn.width,Tn.height,0,$n,Vn,Tn.data);We.generateMipmaps=!1}else Pl?(hn&&n.texStorage2D(e.TEXTURE_2D,En,gn,Gt.width,Gt.height),n.texSubImage2D(e.TEXTURE_2D,0,0,0,Gt.width,Gt.height,$n,Vn,Gt.data)):n.texImage2D(e.TEXTURE_2D,0,gn,Gt.width,Gt.height,0,$n,Vn,Gt.data);else if(We.isCompressedTexture)if(We.isCompressedArrayTexture){Pl&&hn&&n.texStorage3D(e.TEXTURE_2D_ARRAY,En,gn,Zn[0].width,Zn[0].height,Gt.depth);for(let Jt=0,ut=Zn.length;Jt<ut;Jt++)Tn=Zn[Jt],We.format!==aE?$n!==null?Pl?n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Jt,0,0,0,Tn.width,Tn.height,Gt.depth,$n,Tn.data,0,0):n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,Jt,gn,Tn.width,Tn.height,Gt.depth,0,Tn.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pl?n.texSubImage3D(e.TEXTURE_2D_ARRAY,Jt,0,0,0,Tn.width,Tn.height,Gt.depth,$n,Vn,Tn.data):n.texImage3D(e.TEXTURE_2D_ARRAY,Jt,gn,Tn.width,Tn.height,Gt.depth,0,$n,Vn,Tn.data)}else{Pl&&hn&&n.texStorage2D(e.TEXTURE_2D,En,gn,Zn[0].width,Zn[0].height);for(let Jt=0,ut=Zn.length;Jt<ut;Jt++)Tn=Zn[Jt],We.format!==aE?$n!==null?Pl?n.compressedTexSubImage2D(e.TEXTURE_2D,Jt,0,0,Tn.width,Tn.height,$n,Tn.data):n.compressedTexImage2D(e.TEXTURE_2D,Jt,gn,Tn.width,Tn.height,0,Tn.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pl?n.texSubImage2D(e.TEXTURE_2D,Jt,0,0,Tn.width,Tn.height,$n,Vn,Tn.data):n.texImage2D(e.TEXTURE_2D,Jt,gn,Tn.width,Tn.height,0,$n,Vn,Tn.data)}else if(We.isDataArrayTexture)Pl?(hn&&n.texStorage3D(e.TEXTURE_2D_ARRAY,En,gn,Gt.width,Gt.height,Gt.depth),n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,Gt.width,Gt.height,Gt.depth,$n,Vn,Gt.data)):n.texImage3D(e.TEXTURE_2D_ARRAY,0,gn,Gt.width,Gt.height,Gt.depth,0,$n,Vn,Gt.data);else if(We.isData3DTexture)Pl?(hn&&n.texStorage3D(e.TEXTURE_3D,En,gn,Gt.width,Gt.height,Gt.depth),n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,Gt.width,Gt.height,Gt.depth,$n,Vn,Gt.data)):n.texImage3D(e.TEXTURE_3D,0,gn,Gt.width,Gt.height,Gt.depth,0,$n,Vn,Gt.data);else if(We.isFramebufferTexture){if(hn)if(Pl)n.texStorage2D(e.TEXTURE_2D,En,gn,Gt.width,Gt.height);else{let Jt=Gt.width,ut=Gt.height;for(let Kt=0;Kt<En;Kt++)n.texImage2D(e.TEXTURE_2D,Kt,gn,Jt,ut,0,$n,Vn,null),Jt>>=1,ut>>=1}}else if(Zn.length>0&&Rl){Pl&&hn&&n.texStorage2D(e.TEXTURE_2D,En,gn,Zn[0].width,Zn[0].height);for(let Jt=0,ut=Zn.length;Jt<ut;Jt++)Tn=Zn[Jt],Pl?n.texSubImage2D(e.TEXTURE_2D,Jt,0,0,$n,Vn,Tn):n.texImage2D(e.TEXTURE_2D,Jt,gn,$n,Vn,Tn);We.generateMipmaps=!1}else Pl?(hn&&n.texStorage2D(e.TEXTURE_2D,En,gn,Gt.width,Gt.height),n.texSubImage2D(e.TEXTURE_2D,0,0,0,$n,Vn,Gt)):n.texImage2D(e.TEXTURE_2D,0,gn,$n,Vn,Gt);Re(We,Rl)&&Ie(qt),Sn.__version=Wt.version,We.onUpdate&&We.onUpdate(We)}Ye.__version=We.version}function mn(Ye,We,Dt){if(We.image.length!==6)return;const qt=Bt(Ye,We),zt=We.source;n.bindTexture(e.TEXTURE_CUBE_MAP,Ye.__webglTexture,e.TEXTURE0+Dt);const Wt=t.get(zt);if(zt.version!==Wt.__version||qt===!0){n.activeTexture(e.TEXTURE0+Dt);const Sn=qs.getPrimaries(qs.workingColorSpace),on=We.colorSpace===y2?null:qs.getPrimaries(We.colorSpace),In=We.colorSpace===y2||Sn===on?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,We.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,We.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,We.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,In);const bn=We.isCompressedTexture||We.image[0].isCompressedTexture,Hn=We.image[0]&&We.image[0].isDataTexture,Gt=[];for(let Jt=0;Jt<6;Jt++)!bn&&!Hn?Gt[Jt]=de(We.image[Jt],!1,!0,c.maxCubemapSize):Gt[Jt]=Hn?We.image[Jt].image:We.image[Jt],Gt[Jt]=sl(We,Gt[Jt]);const Rl=Gt[0],$n=oe(Rl)||g,Vn=y.convert(We.format,We.colorSpace),gn=y.convert(We.type),Tn=Ne(We.internalFormat,Vn,gn,We.colorSpace),Zn=g&&We.isVideoTexture!==!0,Pl=Wt.__version===void 0||qt===!0;let hn=je(We,Rl,$n);Lt(e.TEXTURE_CUBE_MAP,We,$n);let En;if(bn){Zn&&Pl&&n.texStorage2D(e.TEXTURE_CUBE_MAP,hn,Tn,Rl.width,Rl.height);for(let Jt=0;Jt<6;Jt++){En=Gt[Jt].mipmaps;for(let ut=0;ut<En.length;ut++){const Kt=En[ut];We.format!==aE?Vn!==null?Zn?n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,ut,0,0,Kt.width,Kt.height,Vn,Kt.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,ut,Tn,Kt.width,Kt.height,0,Kt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Zn?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,ut,0,0,Kt.width,Kt.height,Vn,gn,Kt.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,ut,Tn,Kt.width,Kt.height,0,Vn,gn,Kt.data)}}}else{En=We.mipmaps,Zn&&Pl&&(En.length>0&&hn++,n.texStorage2D(e.TEXTURE_CUBE_MAP,hn,Tn,Gt[0].width,Gt[0].height));for(let Jt=0;Jt<6;Jt++)if(Hn){Zn?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,0,0,0,Gt[Jt].width,Gt[Jt].height,Vn,gn,Gt[Jt].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,0,Tn,Gt[Jt].width,Gt[Jt].height,0,Vn,gn,Gt[Jt].data);for(let ut=0;ut<En.length;ut++){const tn=En[ut].image[Jt].image;Zn?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,ut+1,0,0,tn.width,tn.height,Vn,gn,tn.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,ut+1,Tn,tn.width,tn.height,0,Vn,gn,tn.data)}}else{Zn?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,0,0,0,Vn,gn,Gt[Jt]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,0,Tn,Vn,gn,Gt[Jt]);for(let ut=0;ut<En.length;ut++){const Kt=En[ut];Zn?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,ut+1,0,0,Vn,gn,Kt.image[Jt]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Jt,ut+1,Tn,Vn,gn,Kt.image[Jt])}}}Re(We,$n)&&Ie(e.TEXTURE_CUBE_MAP),Wt.__version=zt.version,We.onUpdate&&We.onUpdate(We)}Ye.__version=We.version}function An(Ye,We,Dt,qt,zt,Wt){const Sn=y.convert(Dt.format,Dt.colorSpace),on=y.convert(Dt.type),In=Ne(Dt.internalFormat,Sn,on,Dt.colorSpace);if(!t.get(We).__hasExternalTextures){const Hn=Math.max(1,We.width>>Wt),Gt=Math.max(1,We.height>>Wt);zt===e.TEXTURE_3D||zt===e.TEXTURE_2D_ARRAY?n.texImage3D(zt,Wt,In,Hn,Gt,We.depth,0,Sn,on,null):n.texImage2D(zt,Wt,In,Hn,Gt,0,Sn,on,null)}n.bindFramebuffer(e.FRAMEBUFFER,Ye),wn(We)?U.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,qt,zt,t.get(Dt).__webglTexture,0,_n(We)):(zt===e.TEXTURE_2D||zt>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&zt<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,qt,zt,t.get(Dt).__webglTexture,Wt),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Un(Ye,We,Dt){if(e.bindRenderbuffer(e.RENDERBUFFER,Ye),We.depthBuffer&&!We.stencilBuffer){let qt=g===!0?e.DEPTH_COMPONENT24:e.DEPTH_COMPONENT16;if(Dt||wn(We)){const zt=We.depthTexture;zt&&zt.isDepthTexture&&(zt.type===BN?qt=e.DEPTH_COMPONENT32F:zt.type===HN&&(qt=e.DEPTH_COMPONENT24));const Wt=_n(We);wn(We)?U.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Wt,qt,We.width,We.height):e.renderbufferStorageMultisample(e.RENDERBUFFER,Wt,qt,We.width,We.height)}else e.renderbufferStorage(e.RENDERBUFFER,qt,We.width,We.height);e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,Ye)}else if(We.depthBuffer&&We.stencilBuffer){const qt=_n(We);Dt&&wn(We)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,qt,e.DEPTH24_STENCIL8,We.width,We.height):wn(We)?U.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,qt,e.DEPTH24_STENCIL8,We.width,We.height):e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_STENCIL,We.width,We.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.RENDERBUFFER,Ye)}else{const qt=We.isWebGLMultipleRenderTargets===!0?We.texture:[We.texture];for(let zt=0;zt<qt.length;zt++){const Wt=qt[zt],Sn=y.convert(Wt.format,Wt.colorSpace),on=y.convert(Wt.type),In=Ne(Wt.internalFormat,Sn,on,Wt.colorSpace),bn=_n(We);Dt&&wn(We)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,bn,In,We.width,We.height):wn(We)?U.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,bn,In,We.width,We.height):e.renderbufferStorage(e.RENDERBUFFER,In,We.width,We.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Fn(Ye,We){if(We&&We.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(e.FRAMEBUFFER,Ye),!(We.depthTexture&&We.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!t.get(We.depthTexture).__webglTexture||We.depthTexture.image.width!==We.width||We.depthTexture.image.height!==We.height)&&(We.depthTexture.image.width=We.width,We.depthTexture.image.height=We.height,We.depthTexture.needsUpdate=!0),ft(We.depthTexture,0);const qt=t.get(We.depthTexture).__webglTexture,zt=_n(We);if(We.depthTexture.format===eL)wn(We)?U.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,qt,0,zt):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,qt,0);else if(We.depthTexture.format===Hb)wn(We)?U.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,qt,0,zt):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,qt,0);else throw new Error("Unknown depthTexture format")}function yn(Ye){const We=t.get(Ye),Dt=Ye.isWebGLCubeRenderTarget===!0;if(Ye.depthTexture&&!We.__autoAllocateDepthBuffer){if(Dt)throw new Error("target.depthTexture not supported in Cube render targets");Fn(We.__webglFramebuffer,Ye)}else if(Dt){We.__webglDepthbuffer=[];for(let qt=0;qt<6;qt++)n.bindFramebuffer(e.FRAMEBUFFER,We.__webglFramebuffer[qt]),We.__webglDepthbuffer[qt]=e.createRenderbuffer(),Un(We.__webglDepthbuffer[qt],Ye,!1)}else n.bindFramebuffer(e.FRAMEBUFFER,We.__webglFramebuffer),We.__webglDepthbuffer=e.createRenderbuffer(),Un(We.__webglDepthbuffer,Ye,!1);n.bindFramebuffer(e.FRAMEBUFFER,null)}function el(Ye,We,Dt){const qt=t.get(Ye);We!==void 0&&An(qt.__webglFramebuffer,Ye,Ye.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),Dt!==void 0&&yn(Ye)}function Tt(Ye){const We=Ye.texture,Dt=t.get(Ye),qt=t.get(We);Ye.addEventListener("dispose",Je),Ye.isWebGLMultipleRenderTargets!==!0&&(qt.__webglTexture===void 0&&(qt.__webglTexture=e.createTexture()),qt.__version=We.version,A.memory.textures++);const zt=Ye.isWebGLCubeRenderTarget===!0,Wt=Ye.isWebGLMultipleRenderTargets===!0,Sn=oe(Ye)||g;if(zt){Dt.__webglFramebuffer=[];for(let on=0;on<6;on++)if(g&&We.mipmaps&&We.mipmaps.length>0){Dt.__webglFramebuffer[on]=[];for(let In=0;In<We.mipmaps.length;In++)Dt.__webglFramebuffer[on][In]=e.createFramebuffer()}else Dt.__webglFramebuffer[on]=e.createFramebuffer()}else{if(g&&We.mipmaps&&We.mipmaps.length>0){Dt.__webglFramebuffer=[];for(let on=0;on<We.mipmaps.length;on++)Dt.__webglFramebuffer[on]=e.createFramebuffer()}else Dt.__webglFramebuffer=e.createFramebuffer();if(Wt)if(c.drawBuffers){const on=Ye.texture;for(let In=0,bn=on.length;In<bn;In++){const Hn=t.get(on[In]);Hn.__webglTexture===void 0&&(Hn.__webglTexture=e.createTexture(),A.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(g&&Ye.samples>0&&wn(Ye)===!1){const on=Wt?We:[We];Dt.__webglMultisampledFramebuffer=e.createFramebuffer(),Dt.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,Dt.__webglMultisampledFramebuffer);for(let In=0;In<on.length;In++){const bn=on[In];Dt.__webglColorRenderbuffer[In]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,Dt.__webglColorRenderbuffer[In]);const Hn=y.convert(bn.format,bn.colorSpace),Gt=y.convert(bn.type),Rl=Ne(bn.internalFormat,Hn,Gt,bn.colorSpace,Ye.isXRRenderTarget===!0),$n=_n(Ye);e.renderbufferStorageMultisample(e.RENDERBUFFER,$n,Rl,Ye.width,Ye.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+In,e.RENDERBUFFER,Dt.__webglColorRenderbuffer[In])}e.bindRenderbuffer(e.RENDERBUFFER,null),Ye.depthBuffer&&(Dt.__webglDepthRenderbuffer=e.createRenderbuffer(),Un(Dt.__webglDepthRenderbuffer,Ye,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(zt){n.bindTexture(e.TEXTURE_CUBE_MAP,qt.__webglTexture),Lt(e.TEXTURE_CUBE_MAP,We,Sn);for(let on=0;on<6;on++)if(g&&We.mipmaps&&We.mipmaps.length>0)for(let In=0;In<We.mipmaps.length;In++)An(Dt.__webglFramebuffer[on][In],Ye,We,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+on,In);else An(Dt.__webglFramebuffer[on],Ye,We,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+on,0);Re(We,Sn)&&Ie(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Wt){const on=Ye.texture;for(let In=0,bn=on.length;In<bn;In++){const Hn=on[In],Gt=t.get(Hn);n.bindTexture(e.TEXTURE_2D,Gt.__webglTexture),Lt(e.TEXTURE_2D,Hn,Sn),An(Dt.__webglFramebuffer,Ye,Hn,e.COLOR_ATTACHMENT0+In,e.TEXTURE_2D,0),Re(Hn,Sn)&&Ie(e.TEXTURE_2D)}n.unbindTexture()}else{let on=e.TEXTURE_2D;if((Ye.isWebGL3DRenderTarget||Ye.isWebGLArrayRenderTarget)&&(g?on=Ye.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),n.bindTexture(on,qt.__webglTexture),Lt(on,We,Sn),g&&We.mipmaps&&We.mipmaps.length>0)for(let In=0;In<We.mipmaps.length;In++)An(Dt.__webglFramebuffer[In],Ye,We,e.COLOR_ATTACHMENT0,on,In);else An(Dt.__webglFramebuffer,Ye,We,e.COLOR_ATTACHMENT0,on,0);Re(We,Sn)&&Ie(on),n.unbindTexture()}Ye.depthBuffer&&yn(Ye)}function Xl(Ye){const We=oe(Ye)||g,Dt=Ye.isWebGLMultipleRenderTargets===!0?Ye.texture:[Ye.texture];for(let qt=0,zt=Dt.length;qt<zt;qt++){const Wt=Dt[qt];if(Re(Wt,We)){const Sn=Ye.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:e.TEXTURE_2D,on=t.get(Wt).__webglTexture;n.bindTexture(Sn,on),Ie(Sn),n.unbindTexture()}}}function Mn(Ye){if(g&&Ye.samples>0&&wn(Ye)===!1){const We=Ye.isWebGLMultipleRenderTargets?Ye.texture:[Ye.texture],Dt=Ye.width,qt=Ye.height;let zt=e.COLOR_BUFFER_BIT;const Wt=[],Sn=Ye.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,on=t.get(Ye),In=Ye.isWebGLMultipleRenderTargets===!0;if(In)for(let bn=0;bn<We.length;bn++)n.bindFramebuffer(e.FRAMEBUFFER,on.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+bn,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,on.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+bn,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,on.__webglMultisampledFramebuffer),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,on.__webglFramebuffer);for(let bn=0;bn<We.length;bn++){Wt.push(e.COLOR_ATTACHMENT0+bn),Ye.depthBuffer&&Wt.push(Sn);const Hn=on.__ignoreDepthValues!==void 0?on.__ignoreDepthValues:!1;if(Hn===!1&&(Ye.depthBuffer&&(zt|=e.DEPTH_BUFFER_BIT),Ye.stencilBuffer&&(zt|=e.STENCIL_BUFFER_BIT)),In&&e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,on.__webglColorRenderbuffer[bn]),Hn===!0&&(e.invalidateFramebuffer(e.READ_FRAMEBUFFER,[Sn]),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[Sn])),In){const Gt=t.get(We[bn]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Gt,0)}e.blitFramebuffer(0,0,Dt,qt,0,0,Dt,qt,zt,e.NEAREST),_&&e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Wt)}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),In)for(let bn=0;bn<We.length;bn++){n.bindFramebuffer(e.FRAMEBUFFER,on.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+bn,e.RENDERBUFFER,on.__webglColorRenderbuffer[bn]);const Hn=t.get(We[bn]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,on.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+bn,e.TEXTURE_2D,Hn,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,on.__webglMultisampledFramebuffer)}}function _n(Ye){return Math.min(c.maxSamples,Ye.samples)}function wn(Ye){const We=t.get(Ye);return g&&Ye.samples>0&&l.has("WEBGL_multisampled_render_to_texture")===!0&&We.__useRenderToTexture!==!1}function Bl(Ye){const We=A.render.frame;Q.get(Ye)!==We&&(Q.set(Ye,We),Ye.update())}function sl(Ye,We){const Dt=Ye.colorSpace,qt=Ye.format,zt=Ye.type;return Ye.isCompressedTexture===!0||Ye.isVideoTexture===!0||Ye.format===y_||Dt!==tm&&Dt!==y2&&(qs.getTransfer(Dt)===yr?g===!1?l.has("EXT_sRGB")===!0&&qt===aE?(Ye.format=y_,Ye.minFilter=d2,Ye.generateMipmaps=!1):We=yY.sRGBToLinear(We):(qt!==aE||zt!==jN)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Dt)),We}this.allocateTextureUnit=et,this.resetTextureUnits=ht,this.setTexture2D=ft,this.setTexture2DArray=Nt,this.setTexture3D=bt,this.setTextureCube=Ct,this.rebindTextures=el,this.setupRenderTarget=Tt,this.updateRenderTargetMipmap=Xl,this.updateMultisampleRenderTarget=Mn,this.setupDepthRenderbuffer=yn,this.setupFrameBufferTexture=An,this.useMultisampledRTT=wn}function vZ(e,l,n){const t=n.isWebGL2;function c(y,A=y2){let g;const U=qs.getTransfer(A);if(y===jN)return e.UNSIGNED_BYTE;if(y===uY)return e.UNSIGNED_SHORT_4_4_4_4;if(y===aY)return e.UNSIGNED_SHORT_5_5_5_1;if(y===Dk)return e.BYTE;if(y===Nk)return e.SHORT;if(y===X_)return e.UNSIGNED_SHORT;if(y===rY)return e.INT;if(y===HN)return e.UNSIGNED_INT;if(y===BN)return e.FLOAT;if(y===JH)return t?e.HALF_FLOAT:(g=l.get("OES_texture_half_float"),g!==null?g.HALF_FLOAT_OES:null);if(y===Ak)return e.ALPHA;if(y===aE)return e.RGBA;if(y===Sk)return e.LUMINANCE;if(y===Lk)return e.LUMINANCE_ALPHA;if(y===eL)return e.DEPTH_COMPONENT;if(y===Hb)return e.DEPTH_STENCIL;if(y===y_)return g=l.get("EXT_sRGB"),g!==null?g.SRGB_ALPHA_EXT:null;if(y===Ok)return e.RED;if(y===iY)return e.RED_INTEGER;if(y===gk)return e.RG;if(y===oY)return e.RG_INTEGER;if(y===cY)return e.RGBA_INTEGER;if(y===yG||y===wG||y===EG||y===TG)if(U===yr)if(g=l.get("WEBGL_compressed_texture_s3tc_srgb"),g!==null){if(y===yG)return g.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(y===wG)return g.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(y===EG)return g.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(y===TG)return g.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(g=l.get("WEBGL_compressed_texture_s3tc"),g!==null){if(y===yG)return g.COMPRESSED_RGB_S3TC_DXT1_EXT;if(y===wG)return g.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(y===EG)return g.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(y===TG)return g.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(y===vV||y===eW||y===tW||y===nW)if(g=l.get("WEBGL_compressed_texture_pvrtc"),g!==null){if(y===vV)return g.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(y===eW)return g.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(y===tW)return g.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(y===nW)return g.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(y===hY)return g=l.get("WEBGL_compressed_texture_etc1"),g!==null?g.COMPRESSED_RGB_ETC1_WEBGL:null;if(y===lW||y===sW)if(g=l.get("WEBGL_compressed_texture_etc"),g!==null){if(y===lW)return U===yr?g.COMPRESSED_SRGB8_ETC2:g.COMPRESSED_RGB8_ETC2;if(y===sW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:g.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(y===rW||y===uW||y===aW||y===iW||y===oW||y===cW||y===hW||y===fW||y===IW||y===dW||y===yW||y===wW||y===EW||y===TW)if(g=l.get("WEBGL_compressed_texture_astc"),g!==null){if(y===rW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:g.COMPRESSED_RGBA_ASTC_4x4_KHR;if(y===uW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:g.COMPRESSED_RGBA_ASTC_5x4_KHR;if(y===aW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:g.COMPRESSED_RGBA_ASTC_5x5_KHR;if(y===iW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:g.COMPRESSED_RGBA_ASTC_6x5_KHR;if(y===oW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:g.COMPRESSED_RGBA_ASTC_6x6_KHR;if(y===cW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:g.COMPRESSED_RGBA_ASTC_8x5_KHR;if(y===hW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:g.COMPRESSED_RGBA_ASTC_8x6_KHR;if(y===fW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:g.COMPRESSED_RGBA_ASTC_8x8_KHR;if(y===IW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:g.COMPRESSED_RGBA_ASTC_10x5_KHR;if(y===dW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:g.COMPRESSED_RGBA_ASTC_10x6_KHR;if(y===yW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:g.COMPRESSED_RGBA_ASTC_10x8_KHR;if(y===wW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:g.COMPRESSED_RGBA_ASTC_10x10_KHR;if(y===EW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:g.COMPRESSED_RGBA_ASTC_12x10_KHR;if(y===TW)return U===yr?g.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:g.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(y===pG||y===pW||y===RW)if(g=l.get("EXT_texture_compression_bptc"),g!==null){if(y===pG)return U===yr?g.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:g.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(y===pW)return g.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(y===RW)return g.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(y===Pk||y===mW||y===DW||y===NW)if(g=l.get("EXT_texture_compression_rgtc"),g!==null){if(y===pG)return g.COMPRESSED_RED_RGTC1_EXT;if(y===mW)return g.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(y===DW)return g.COMPRESSED_RED_GREEN_RGTC2_EXT;if(y===NW)return g.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return y===v8?t?e.UNSIGNED_INT_24_8:(g=l.get("WEBGL_depth_texture"),g!==null?g.UNSIGNED_INT_24_8_WEBGL:null):e[y]!==void 0?e[y]:null}return{convert:c}}class eJ extends rE{constructor(l=[]){super(),this.isArrayCamera=!0,this.cameras=l}}class cH extends vf{constructor(){super(),this.isGroup=!0,this.type="Group"}}const tJ={type:"move"};class jG{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new cH,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new cH,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new nt,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new nt),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new cH,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new nt,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new nt),this._grip}dispatchEvent(l){return this._targetRay!==null&&this._targetRay.dispatchEvent(l),this._grip!==null&&this._grip.dispatchEvent(l),this._hand!==null&&this._hand.dispatchEvent(l),this}connect(l){if(l&&l.hand){const n=this._hand;if(n)for(const t of l.hand.values())this._getHandJoint(n,t)}return this.dispatchEvent({type:"connected",data:l}),this}disconnect(l){return this.dispatchEvent({type:"disconnected",data:l}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(l,n,t){let c=null,y=null,A=null;const g=this._targetRay,U=this._grip,_=this._hand;if(l&&n.session.visibilityState!=="visible-blurred"){if(_&&l.hand){A=!0;for(const de of l.hand.values()){const oe=n.getJointPose(de,t),ie=this._getHandJoint(_,de);oe!==null&&(ie.matrix.fromArray(oe.transform.matrix),ie.matrix.decompose(ie.position,ie.rotation,ie.scale),ie.matrixWorldNeedsUpdate=!0,ie.jointRadius=oe.radius),ie.visible=oe!==null}const Q=_.joints["index-finger-tip"],ee=_.joints["thumb-tip"],J=Q.position.distanceTo(ee.position),te=.02,he=.005;_.inputState.pinching&&J>te+he?(_.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:l.handedness,target:this})):!_.inputState.pinching&&J<=te-he&&(_.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:l.handedness,target:this}))}else U!==null&&l.gripSpace&&(y=n.getPose(l.gripSpace,t),y!==null&&(U.matrix.fromArray(y.transform.matrix),U.matrix.decompose(U.position,U.rotation,U.scale),U.matrixWorldNeedsUpdate=!0,y.linearVelocity?(U.hasLinearVelocity=!0,U.linearVelocity.copy(y.linearVelocity)):U.hasLinearVelocity=!1,y.angularVelocity?(U.hasAngularVelocity=!0,U.angularVelocity.copy(y.angularVelocity)):U.hasAngularVelocity=!1));g!==null&&(c=n.getPose(l.targetRaySpace,t),c===null&&y!==null&&(c=y),c!==null&&(g.matrix.fromArray(c.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,c.linearVelocity?(g.hasLinearVelocity=!0,g.linearVelocity.copy(c.linearVelocity)):g.hasLinearVelocity=!1,c.angularVelocity?(g.hasAngularVelocity=!0,g.angularVelocity.copy(c.angularVelocity)):g.hasAngularVelocity=!1,this.dispatchEvent(tJ)))}return g!==null&&(g.visible=c!==null),U!==null&&(U.visible=y!==null),_!==null&&(_.visible=A!==null),this}_getHandJoint(l,n){if(l.joints[n.jointName]===void 0){const t=new cH;t.matrixAutoUpdate=!1,t.visible=!1,l.joints[n.jointName]=t,l.add(t)}return l.joints[n.jointName]}}class nJ extends $b{constructor(l,n){super();const t=this;let c=null,y=1,A=null,g="local-floor",U=1,_=null,Q=null,ee=null,J=null,te=null,he=null;const de=n.getContextAttributes();let oe=null,ie=null;const Re=[],Ie=[],Ne=new Nl;let je=null;const Be=new rE;Be.layers.enable(1),Be.viewport=new Gc;const Fe=new rE;Fe.layers.enable(2),Fe.viewport=new Gc;const Je=[Be,Fe],ge=new eJ;ge.layers.enable(1),ge.layers.enable(2);let Le=null,Xe=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Lt){let Bt=Re[Lt];return Bt===void 0&&(Bt=new jG,Re[Lt]=Bt),Bt.getTargetRaySpace()},this.getControllerGrip=function(Lt){let Bt=Re[Lt];return Bt===void 0&&(Bt=new jG,Re[Lt]=Bt),Bt.getGripSpace()},this.getHand=function(Lt){let Bt=Re[Lt];return Bt===void 0&&(Bt=new jG,Re[Lt]=Bt),Bt.getHandSpace()};function lt(Lt){const Bt=Ie.indexOf(Lt.inputSource);if(Bt===-1)return;const Xt=Re[Bt];Xt!==void 0&&(Xt.update(Lt.inputSource,Lt.frame,_||A),Xt.dispatchEvent({type:Lt.type,data:Lt.inputSource}))}function ht(){c.removeEventListener("select",lt),c.removeEventListener("selectstart",lt),c.removeEventListener("selectend",lt),c.removeEventListener("squeeze",lt),c.removeEventListener("squeezestart",lt),c.removeEventListener("squeezeend",lt),c.removeEventListener("end",ht),c.removeEventListener("inputsourceschange",et);for(let Lt=0;Lt<Re.length;Lt++){const Bt=Ie[Lt];Bt!==null&&(Ie[Lt]=null,Re[Lt].disconnect(Bt))}Le=null,Xe=null,l.setRenderTarget(oe),te=null,J=null,ee=null,c=null,ie=null,Ut.stop(),t.isPresenting=!1,l.setPixelRatio(je),l.setSize(Ne.width,Ne.height,!1),t.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Lt){y=Lt,t.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Lt){g=Lt,t.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return _||A},this.setReferenceSpace=function(Lt){_=Lt},this.getBaseLayer=function(){return J!==null?J:te},this.getBinding=function(){return ee},this.getFrame=function(){return he},this.getSession=function(){return c},this.setSession=async function(Lt){if(c=Lt,c!==null){if(oe=l.getRenderTarget(),c.addEventListener("select",lt),c.addEventListener("selectstart",lt),c.addEventListener("selectend",lt),c.addEventListener("squeeze",lt),c.addEventListener("squeezestart",lt),c.addEventListener("squeezeend",lt),c.addEventListener("end",ht),c.addEventListener("inputsourceschange",et),de.xrCompatible!==!0&&await n.makeXRCompatible(),je=l.getPixelRatio(),l.getSize(Ne),c.renderState.layers===void 0||l.capabilities.isWebGL2===!1){const Bt={antialias:c.renderState.layers===void 0?de.antialias:!0,alpha:!0,depth:de.depth,stencil:de.stencil,framebufferScaleFactor:y};te=new XRWebGLLayer(c,n,Bt),c.updateRenderState({baseLayer:te}),l.setPixelRatio(1),l.setSize(te.framebufferWidth,te.framebufferHeight,!1),ie=new kN(te.framebufferWidth,te.framebufferHeight,{format:aE,type:jN,colorSpace:l.outputColorSpace,stencilBuffer:de.stencil})}else{let Bt=null,Xt=null,mn=null;de.depth&&(mn=de.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Bt=de.stencil?Hb:eL,Xt=de.stencil?v8:HN);const An={colorFormat:n.RGBA8,depthFormat:mn,scaleFactor:y};ee=new XRWebGLBinding(c,n),J=ee.createProjectionLayer(An),c.updateRenderState({layers:[J]}),l.setPixelRatio(1),l.setSize(J.textureWidth,J.textureHeight,!1),ie=new kN(J.textureWidth,J.textureHeight,{format:aE,type:jN,depthTexture:new OY(J.textureWidth,J.textureHeight,Xt,void 0,void 0,void 0,void 0,void 0,void 0,Bt),stencilBuffer:de.stencil,colorSpace:l.outputColorSpace,samples:de.antialias?4:0});const Un=l.properties.get(ie);Un.__ignoreDepthValues=J.ignoreDepthValues}ie.isXRRenderTarget=!0,this.setFoveation(U),_=null,A=await c.requestReferenceSpace(g),Ut.setContext(c),Ut.start(),t.isPresenting=!0,t.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(c!==null)return c.environmentBlendMode};function et(Lt){for(let Bt=0;Bt<Lt.removed.length;Bt++){const Xt=Lt.removed[Bt],mn=Ie.indexOf(Xt);mn>=0&&(Ie[mn]=null,Re[mn].disconnect(Xt))}for(let Bt=0;Bt<Lt.added.length;Bt++){const Xt=Lt.added[Bt];let mn=Ie.indexOf(Xt);if(mn===-1){for(let Un=0;Un<Re.length;Un++)if(Un>=Ie.length){Ie.push(Xt),mn=Un;break}else if(Ie[Un]===null){Ie[Un]=Xt,mn=Un;break}if(mn===-1)break}const An=Re[mn];An&&An.connect(Xt)}}const at=new nt,ft=new nt;function Nt(Lt,Bt,Xt){at.setFromMatrixPosition(Bt.matrixWorld),ft.setFromMatrixPosition(Xt.matrixWorld);const mn=at.distanceTo(ft),An=Bt.projectionMatrix.elements,Un=Xt.projectionMatrix.elements,Fn=An[14]/(An[10]-1),yn=An[14]/(An[10]+1),el=(An[9]+1)/An[5],Tt=(An[9]-1)/An[5],Xl=(An[8]-1)/An[0],Mn=(Un[8]+1)/Un[0],_n=Fn*Xl,wn=Fn*Mn,Bl=mn/(-Xl+Mn),sl=Bl*-Xl;Bt.matrixWorld.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.translateX(sl),Lt.translateZ(Bl),Lt.matrixWorld.compose(Lt.position,Lt.quaternion,Lt.scale),Lt.matrixWorldInverse.copy(Lt.matrixWorld).invert();const Ye=Fn+Bl,We=yn+Bl,Dt=_n-sl,qt=wn+(mn-sl),zt=el*yn/We*Ye,Wt=Tt*yn/We*Ye;Lt.projectionMatrix.makePerspective(Dt,qt,zt,Wt,Ye,We),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert()}function bt(Lt,Bt){Bt===null?Lt.matrixWorld.copy(Lt.matrix):Lt.matrixWorld.multiplyMatrices(Bt.matrixWorld,Lt.matrix),Lt.matrixWorldInverse.copy(Lt.matrixWorld).invert()}this.updateCamera=function(Lt){if(c===null)return;ge.near=Fe.near=Be.near=Lt.near,ge.far=Fe.far=Be.far=Lt.far,(Le!==ge.near||Xe!==ge.far)&&(c.updateRenderState({depthNear:ge.near,depthFar:ge.far}),Le=ge.near,Xe=ge.far);const Bt=Lt.parent,Xt=ge.cameras;bt(ge,Bt);for(let mn=0;mn<Xt.length;mn++)bt(Xt[mn],Bt);Xt.length===2?Nt(ge,Be,Fe):ge.projectionMatrix.copy(Be.projectionMatrix),Ct(Lt,ge,Bt)};function Ct(Lt,Bt,Xt){Xt===null?Lt.matrix.copy(Bt.matrixWorld):(Lt.matrix.copy(Xt.matrixWorld),Lt.matrix.invert(),Lt.matrix.multiply(Bt.matrixWorld)),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.updateMatrixWorld(!0),Lt.projectionMatrix.copy(Bt.projectionMatrix),Lt.projectionMatrixInverse.copy(Bt.projectionMatrixInverse),Lt.isPerspectiveCamera&&(Lt.fov=XH*2*Math.atan(1/Lt.projectionMatrix.elements[5]),Lt.zoom=1)}this.getCamera=function(){return ge},this.getFoveation=function(){if(!(J===null&&te===null))return U},this.setFoveation=function(Lt){U=Lt,J!==null&&(J.fixedFoveation=Lt),te!==null&&te.fixedFoveation!==void 0&&(te.fixedFoveation=Lt)};let Ft=null;function Ht(Lt,Bt){if(Q=Bt.getViewerPose(_||A),he=Bt,Q!==null){const Xt=Q.views;te!==null&&(l.setRenderTargetFramebuffer(ie,te.framebuffer),l.setRenderTarget(ie));let mn=!1;Xt.length!==ge.cameras.length&&(ge.cameras.length=0,mn=!0);for(let An=0;An<Xt.length;An++){const Un=Xt[An];let Fn=null;if(te!==null)Fn=te.getViewport(Un);else{const el=ee.getViewSubImage(J,Un);Fn=el.viewport,An===0&&(l.setRenderTargetTextures(ie,el.colorTexture,J.ignoreDepthValues?void 0:el.depthStencilTexture),l.setRenderTarget(ie))}let yn=Je[An];yn===void 0&&(yn=new rE,yn.layers.enable(An),yn.viewport=new Gc,Je[An]=yn),yn.matrix.fromArray(Un.transform.matrix),yn.matrix.decompose(yn.position,yn.quaternion,yn.scale),yn.projectionMatrix.fromArray(Un.projectionMatrix),yn.projectionMatrixInverse.copy(yn.projectionMatrix).invert(),yn.viewport.set(Fn.x,Fn.y,Fn.width,Fn.height),An===0&&(ge.matrix.copy(yn.matrix),ge.matrix.decompose(ge.position,ge.quaternion,ge.scale)),mn===!0&&ge.cameras.push(yn)}}for(let Xt=0;Xt<Re.length;Xt++){const mn=Ie[Xt],An=Re[Xt];mn!==null&&An!==void 0&&An.update(mn,Bt,_||A)}Ft&&Ft(Lt,Bt),Bt.detectedPlanes&&t.dispatchEvent({type:"planesdetected",data:Bt}),he=null}const Ut=new SY;Ut.setAnimationLoop(Ht),this.setAnimationLoop=function(Lt){Ft=Lt},this.dispose=function(){}}}function lJ(e,l){function n(oe,ie){oe.matrixAutoUpdate===!0&&oe.updateMatrix(),ie.value.copy(oe.matrix)}function t(oe,ie){ie.color.getRGB(oe.fogColor.value,DY(e)),ie.isFog?(oe.fogNear.value=ie.near,oe.fogFar.value=ie.far):ie.isFogExp2&&(oe.fogDensity.value=ie.density)}function c(oe,ie,Re,Ie,Ne){ie.isMeshBasicMaterial||ie.isMeshLambertMaterial?y(oe,ie):ie.isMeshToonMaterial?(y(oe,ie),ee(oe,ie)):ie.isMeshPhongMaterial?(y(oe,ie),Q(oe,ie)):ie.isMeshStandardMaterial?(y(oe,ie),J(oe,ie),ie.isMeshPhysicalMaterial&&te(oe,ie,Ne)):ie.isMeshMatcapMaterial?(y(oe,ie),he(oe,ie)):ie.isMeshDepthMaterial?y(oe,ie):ie.isMeshDistanceMaterial?(y(oe,ie),de(oe,ie)):ie.isMeshNormalMaterial?y(oe,ie):ie.isLineBasicMaterial?(A(oe,ie),ie.isLineDashedMaterial&&g(oe,ie)):ie.isPointsMaterial?U(oe,ie,Re,Ie):ie.isSpriteMaterial?_(oe,ie):ie.isShadowMaterial?(oe.color.value.copy(ie.color),oe.opacity.value=ie.opacity):ie.isShaderMaterial&&(ie.uniformsNeedUpdate=!1)}function y(oe,ie){oe.opacity.value=ie.opacity,ie.color&&oe.diffuse.value.copy(ie.color),ie.emissive&&oe.emissive.value.copy(ie.emissive).multiplyScalar(ie.emissiveIntensity),ie.map&&(oe.map.value=ie.map,n(ie.map,oe.mapTransform)),ie.alphaMap&&(oe.alphaMap.value=ie.alphaMap,n(ie.alphaMap,oe.alphaMapTransform)),ie.bumpMap&&(oe.bumpMap.value=ie.bumpMap,n(ie.bumpMap,oe.bumpMapTransform),oe.bumpScale.value=ie.bumpScale,ie.side===S3&&(oe.bumpScale.value*=-1)),ie.normalMap&&(oe.normalMap.value=ie.normalMap,n(ie.normalMap,oe.normalMapTransform),oe.normalScale.value.copy(ie.normalScale),ie.side===S3&&oe.normalScale.value.negate()),ie.displacementMap&&(oe.displacementMap.value=ie.displacementMap,n(ie.displacementMap,oe.displacementMapTransform),oe.displacementScale.value=ie.displacementScale,oe.displacementBias.value=ie.displacementBias),ie.emissiveMap&&(oe.emissiveMap.value=ie.emissiveMap,n(ie.emissiveMap,oe.emissiveMapTransform)),ie.specularMap&&(oe.specularMap.value=ie.specularMap,n(ie.specularMap,oe.specularMapTransform)),ie.alphaTest>0&&(oe.alphaTest.value=ie.alphaTest);const Re=l.get(ie).envMap;if(Re&&(oe.envMap.value=Re,oe.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1,oe.reflectivity.value=ie.reflectivity,oe.ior.value=ie.ior,oe.refractionRatio.value=ie.refractionRatio),ie.lightMap){oe.lightMap.value=ie.lightMap;const Ie=e._useLegacyLights===!0?Math.PI:1;oe.lightMapIntensity.value=ie.lightMapIntensity*Ie,n(ie.lightMap,oe.lightMapTransform)}ie.aoMap&&(oe.aoMap.value=ie.aoMap,oe.aoMapIntensity.value=ie.aoMapIntensity,n(ie.aoMap,oe.aoMapTransform))}function A(oe,ie){oe.diffuse.value.copy(ie.color),oe.opacity.value=ie.opacity,ie.map&&(oe.map.value=ie.map,n(ie.map,oe.mapTransform))}function g(oe,ie){oe.dashSize.value=ie.dashSize,oe.totalSize.value=ie.dashSize+ie.gapSize,oe.scale.value=ie.scale}function U(oe,ie,Re,Ie){oe.diffuse.value.copy(ie.color),oe.opacity.value=ie.opacity,oe.size.value=ie.size*Re,oe.scale.value=Ie*.5,ie.map&&(oe.map.value=ie.map,n(ie.map,oe.uvTransform)),ie.alphaMap&&(oe.alphaMap.value=ie.alphaMap,n(ie.alphaMap,oe.alphaMapTransform)),ie.alphaTest>0&&(oe.alphaTest.value=ie.alphaTest)}function _(oe,ie){oe.diffuse.value.copy(ie.color),oe.opacity.value=ie.opacity,oe.rotation.value=ie.rotation,ie.map&&(oe.map.value=ie.map,n(ie.map,oe.mapTransform)),ie.alphaMap&&(oe.alphaMap.value=ie.alphaMap,n(ie.alphaMap,oe.alphaMapTransform)),ie.alphaTest>0&&(oe.alphaTest.value=ie.alphaTest)}function Q(oe,ie){oe.specular.value.copy(ie.specular),oe.shininess.value=Math.max(ie.shininess,1e-4)}function ee(oe,ie){ie.gradientMap&&(oe.gradientMap.value=ie.gradientMap)}function J(oe,ie){oe.metalness.value=ie.metalness,ie.metalnessMap&&(oe.metalnessMap.value=ie.metalnessMap,n(ie.metalnessMap,oe.metalnessMapTransform)),oe.roughness.value=ie.roughness,ie.roughnessMap&&(oe.roughnessMap.value=ie.roughnessMap,n(ie.roughnessMap,oe.roughnessMapTransform)),l.get(ie).envMap&&(oe.envMapIntensity.value=ie.envMapIntensity)}function te(oe,ie,Re){oe.ior.value=ie.ior,ie.sheen>0&&(oe.sheenColor.value.copy(ie.sheenColor).multiplyScalar(ie.sheen),oe.sheenRoughness.value=ie.sheenRoughness,ie.sheenColorMap&&(oe.sheenColorMap.value=ie.sheenColorMap,n(ie.sheenColorMap,oe.sheenColorMapTransform)),ie.sheenRoughnessMap&&(oe.sheenRoughnessMap.value=ie.sheenRoughnessMap,n(ie.sheenRoughnessMap,oe.sheenRoughnessMapTransform))),ie.clearcoat>0&&(oe.clearcoat.value=ie.clearcoat,oe.clearcoatRoughness.value=ie.clearcoatRoughness,ie.clearcoatMap&&(oe.clearcoatMap.value=ie.clearcoatMap,n(ie.clearcoatMap,oe.clearcoatMapTransform)),ie.clearcoatRoughnessMap&&(oe.clearcoatRoughnessMap.value=ie.clearcoatRoughnessMap,n(ie.clearcoatRoughnessMap,oe.clearcoatRoughnessMapTransform)),ie.clearcoatNormalMap&&(oe.clearcoatNormalMap.value=ie.clearcoatNormalMap,n(ie.clearcoatNormalMap,oe.clearcoatNormalMapTransform),oe.clearcoatNormalScale.value.copy(ie.clearcoatNormalScale),ie.side===S3&&oe.clearcoatNormalScale.value.negate())),ie.iridescence>0&&(oe.iridescence.value=ie.iridescence,oe.iridescenceIOR.value=ie.iridescenceIOR,oe.iridescenceThicknessMinimum.value=ie.iridescenceThicknessRange[0],oe.iridescenceThicknessMaximum.value=ie.iridescenceThicknessRange[1],ie.iridescenceMap&&(oe.iridescenceMap.value=ie.iridescenceMap,n(ie.iridescenceMap,oe.iridescenceMapTransform)),ie.iridescenceThicknessMap&&(oe.iridescenceThicknessMap.value=ie.iridescenceThicknessMap,n(ie.iridescenceThicknessMap,oe.iridescenceThicknessMapTransform))),ie.transmission>0&&(oe.transmission.value=ie.transmission,oe.transmissionSamplerMap.value=Re.texture,oe.transmissionSamplerSize.value.set(Re.width,Re.height),ie.transmissionMap&&(oe.transmissionMap.value=ie.transmissionMap,n(ie.transmissionMap,oe.transmissionMapTransform)),oe.thickness.value=ie.thickness,ie.thicknessMap&&(oe.thicknessMap.value=ie.thicknessMap,n(ie.thicknessMap,oe.thicknessMapTransform)),oe.attenuationDistance.value=ie.attenuationDistance,oe.attenuationColor.value.copy(ie.attenuationColor)),ie.anisotropy>0&&(oe.anisotropyVector.value.set(ie.anisotropy*Math.cos(ie.anisotropyRotation),ie.anisotropy*Math.sin(ie.anisotropyRotation)),ie.anisotropyMap&&(oe.anisotropyMap.value=ie.anisotropyMap,n(ie.anisotropyMap,oe.anisotropyMapTransform))),oe.specularIntensity.value=ie.specularIntensity,oe.specularColor.value.copy(ie.specularColor),ie.specularColorMap&&(oe.specularColorMap.value=ie.specularColorMap,n(ie.specularColorMap,oe.specularColorMapTransform)),ie.specularIntensityMap&&(oe.specularIntensityMap.value=ie.specularIntensityMap,n(ie.specularIntensityMap,oe.specularIntensityMapTransform))}function he(oe,ie){ie.matcap&&(oe.matcap.value=ie.matcap)}function de(oe,ie){const Re=l.get(ie).light;oe.referencePosition.value.setFromMatrixPosition(Re.matrixWorld),oe.nearDistance.value=Re.shadow.camera.near,oe.farDistance.value=Re.shadow.camera.far}return{refreshFogUniforms:t,refreshMaterialUniforms:c}}function sJ(e,l,n,t){let c={},y={},A=[];const g=n.isWebGL2?e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS):0;function U(Re,Ie){const Ne=Ie.program;t.uniformBlockBinding(Re,Ne)}function _(Re,Ie){let Ne=c[Re.id];Ne===void 0&&(he(Re),Ne=Q(Re),c[Re.id]=Ne,Re.addEventListener("dispose",oe));const je=Ie.program;t.updateUBOMapping(Re,je);const Be=l.render.frame;y[Re.id]!==Be&&(J(Re),y[Re.id]=Be)}function Q(Re){const Ie=ee();Re.__bindingPointIndex=Ie;const Ne=e.createBuffer(),je=Re.__size,Be=Re.usage;return e.bindBuffer(e.UNIFORM_BUFFER,Ne),e.bufferData(e.UNIFORM_BUFFER,je,Be),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,Ie,Ne),Ne}function ee(){for(let Re=0;Re<g;Re++)if(A.indexOf(Re)===-1)return A.push(Re),Re;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function J(Re){const Ie=c[Re.id],Ne=Re.uniforms,je=Re.__cache;e.bindBuffer(e.UNIFORM_BUFFER,Ie);for(let Be=0,Fe=Ne.length;Be<Fe;Be++){const Je=Array.isArray(Ne[Be])?Ne[Be]:[Ne[Be]];for(let ge=0,Le=Je.length;ge<Le;ge++){const Xe=Je[ge];if(te(Xe,Be,ge,je)===!0){const lt=Xe.__offset,ht=Array.isArray(Xe.value)?Xe.value:[Xe.value];let et=0;for(let at=0;at<ht.length;at++){const ft=ht[at],Nt=de(ft);typeof ft=="number"||typeof ft=="boolean"?(Xe.__data[0]=ft,e.bufferSubData(e.UNIFORM_BUFFER,lt+et,Xe.__data)):ft.isMatrix3?(Xe.__data[0]=ft.elements[0],Xe.__data[1]=ft.elements[1],Xe.__data[2]=ft.elements[2],Xe.__data[3]=0,Xe.__data[4]=ft.elements[3],Xe.__data[5]=ft.elements[4],Xe.__data[6]=ft.elements[5],Xe.__data[7]=0,Xe.__data[8]=ft.elements[6],Xe.__data[9]=ft.elements[7],Xe.__data[10]=ft.elements[8],Xe.__data[11]=0):(ft.toArray(Xe.__data,et),et+=Nt.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,lt,Xe.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function te(Re,Ie,Ne,je){const Be=Re.value,Fe=Ie+"_"+Ne;if(je[Fe]===void 0)return typeof Be=="number"||typeof Be=="boolean"?je[Fe]=Be:je[Fe]=Be.clone(),!0;{const Je=je[Fe];if(typeof Be=="number"||typeof Be=="boolean"){if(Je!==Be)return je[Fe]=Be,!0}else if(Je.equals(Be)===!1)return Je.copy(Be),!0}return!1}function he(Re){const Ie=Re.uniforms;let Ne=0;const je=16;for(let Fe=0,Je=Ie.length;Fe<Je;Fe++){const ge=Array.isArray(Ie[Fe])?Ie[Fe]:[Ie[Fe]];for(let Le=0,Xe=ge.length;Le<Xe;Le++){const lt=ge[Le],ht=Array.isArray(lt.value)?lt.value:[lt.value];for(let et=0,at=ht.length;et<at;et++){const ft=ht[et],Nt=de(ft),bt=Ne%je;bt!==0&&je-bt<Nt.boundary&&(Ne+=je-bt),lt.__data=new Float32Array(Nt.storage/Float32Array.BYTES_PER_ELEMENT),lt.__offset=Ne,Ne+=Nt.storage}}}const Be=Ne%je;return Be>0&&(Ne+=je-Be),Re.__size=Ne,Re.__cache={},this}function de(Re){const Ie={boundary:0,storage:0};return typeof Re=="number"||typeof Re=="boolean"?(Ie.boundary=4,Ie.storage=4):Re.isVector2?(Ie.boundary=8,Ie.storage=8):Re.isVector3||Re.isColor?(Ie.boundary=16,Ie.storage=12):Re.isVector4?(Ie.boundary=16,Ie.storage=16):Re.isMatrix3?(Ie.boundary=48,Ie.storage=48):Re.isMatrix4?(Ie.boundary=64,Ie.storage=64):Re.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",Re),Ie}function oe(Re){const Ie=Re.target;Ie.removeEventListener("dispose",oe);const Ne=A.indexOf(Ie.__bindingPointIndex);A.splice(Ne,1),e.deleteBuffer(c[Ie.id]),delete c[Ie.id],delete y[Ie.id]}function ie(){for(const Re in c)e.deleteBuffer(c[Re]);A=[],c={},y={}}return{bind:U,update:_,dispose:ie}}class rJ{constructor(l={}){const{canvas:n=eq(),context:t=null,depth:c=!0,stencil:y=!0,alpha:A=!1,antialias:g=!1,premultipliedAlpha:U=!0,preserveDrawingBuffer:_=!1,powerPreference:Q="default",failIfMajorPerformanceCaveat:ee=!1}=l;this.isWebGLRenderer=!0;let J;t!==null?J=t.getContextAttributes().alpha:J=A;const te=new Uint32Array(4),he=new Int32Array(4);let de=null,oe=null;const ie=[],Re=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Qf,this._useLegacyLights=!1,this.toneMapping=WN,this.toneMappingExposure=1;const Ie=this;let Ne=!1,je=0,Be=0,Fe=null,Je=-1,ge=null;const Le=new Gc,Xe=new Gc;let lt=null;const ht=new Sl(0);let et=0,at=n.width,ft=n.height,Nt=1,bt=null,Ct=null;const Ft=new Gc(0,0,at,ft),Ht=new Gc(0,0,at,ft);let Ut=!1;const Lt=new lV;let Bt=!1,Xt=!1,mn=null;const An=new Ll,Un=new Nl,Fn=new nt,yn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function el(){return Fe===null?Nt:1}let Tt=t;function Xl(ke,It){for(let At=0;At<ke.length;At++){const ye=ke[At],pt=n.getContext(ye,It);if(pt!==null)return pt}return null}try{const ke={alpha:!0,depth:c,stencil:y,antialias:g,premultipliedAlpha:U,preserveDrawingBuffer:_,powerPreference:Q,failIfMajorPerformanceCaveat:ee};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Z_}`),n.addEventListener("webglcontextlost",Jt,!1),n.addEventListener("webglcontextrestored",ut,!1),n.addEventListener("webglcontextcreationerror",Kt,!1),Tt===null){const It=["webgl2","webgl","experimental-webgl"];if(Ie.isWebGL1Renderer===!0&&It.shift(),Tt=Xl(It,ke),Tt===null)throw Xl(It)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&Tt instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),Tt.getShaderPrecisionFormat===void 0&&(Tt.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(ke){throw console.error("THREE.WebGLRenderer: "+ke.message),ke}let Mn,_n,wn,Bl,sl,Ye,We,Dt,qt,zt,Wt,Sn,on,In,bn,Hn,Gt,Rl,$n,Vn,gn,Tn,Zn,Pl;function hn(){Mn=new d$(Tt),_n=new i$(Tt,Mn,l),Mn.init(_n),Tn=new vZ(Tt,Mn,_n),wn=new JZ(Tt,Mn,_n),Bl=new E$(Tt),sl=new FZ,Ye=new XZ(Tt,Mn,wn,sl,_n,Tn,Bl),We=new c$(Ie),Dt=new I$(Ie),qt=new Sq(Tt,_n),Zn=new u$(Tt,Mn,qt,_n),zt=new y$(Tt,qt,Bl,Zn),Wt=new m$(Tt,zt,qt,Bl),$n=new R$(Tt,_n,Ye),Hn=new o$(sl),Sn=new UZ(Ie,We,Dt,Mn,_n,Zn,Hn),on=new lJ(Ie,sl),In=new _Z,bn=new kZ(Mn,_n),Rl=new r$(Ie,We,Dt,wn,Wt,J,U),Gt=new ZZ(Ie,Wt,_n),Pl=new sJ(Tt,Bl,_n,wn),Vn=new a$(Tt,Mn,Bl,_n),gn=new w$(Tt,Mn,Bl,_n),Bl.programs=Sn.programs,Ie.capabilities=_n,Ie.extensions=Mn,Ie.properties=sl,Ie.renderLists=In,Ie.shadowMap=Gt,Ie.state=wn,Ie.info=Bl}hn();const En=new nJ(Ie,Tt);this.xr=En,this.getContext=function(){return Tt},this.getContextAttributes=function(){return Tt.getContextAttributes()},this.forceContextLoss=function(){const ke=Mn.get("WEBGL_lose_context");ke&&ke.loseContext()},this.forceContextRestore=function(){const ke=Mn.get("WEBGL_lose_context");ke&&ke.restoreContext()},this.getPixelRatio=function(){return Nt},this.setPixelRatio=function(ke){ke!==void 0&&(Nt=ke,this.setSize(at,ft,!1))},this.getSize=function(ke){return ke.set(at,ft)},this.setSize=function(ke,It,At=!0){if(En.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}at=ke,ft=It,n.width=Math.floor(ke*Nt),n.height=Math.floor(It*Nt),At===!0&&(n.style.width=ke+"px",n.style.height=It+"px"),this.setViewport(0,0,ke,It)},this.getDrawingBufferSize=function(ke){return ke.set(at*Nt,ft*Nt).floor()},this.setDrawingBufferSize=function(ke,It,At){at=ke,ft=It,Nt=At,n.width=Math.floor(ke*At),n.height=Math.floor(It*At),this.setViewport(0,0,ke,It)},this.getCurrentViewport=function(ke){return ke.copy(Le)},this.getViewport=function(ke){return ke.copy(Ft)},this.setViewport=function(ke,It,At,ye){ke.isVector4?Ft.set(ke.x,ke.y,ke.z,ke.w):Ft.set(ke,It,At,ye),wn.viewport(Le.copy(Ft).multiplyScalar(Nt).floor())},this.getScissor=function(ke){return ke.copy(Ht)},this.setScissor=function(ke,It,At,ye){ke.isVector4?Ht.set(ke.x,ke.y,ke.z,ke.w):Ht.set(ke,It,At,ye),wn.scissor(Xe.copy(Ht).multiplyScalar(Nt).floor())},this.getScissorTest=function(){return Ut},this.setScissorTest=function(ke){wn.setScissorTest(Ut=ke)},this.setOpaqueSort=function(ke){bt=ke},this.setTransparentSort=function(ke){Ct=ke},this.getClearColor=function(ke){return ke.copy(Rl.getClearColor())},this.setClearColor=function(){Rl.setClearColor.apply(Rl,arguments)},this.getClearAlpha=function(){return Rl.getClearAlpha()},this.setClearAlpha=function(){Rl.setClearAlpha.apply(Rl,arguments)},this.clear=function(ke=!0,It=!0,At=!0){let ye=0;if(ke){let pt=!1;if(Fe!==null){const an=Fe.texture.format;pt=an===cY||an===oY||an===iY}if(pt){const an=Fe.texture.type,Nn=an===jN||an===HN||an===X_||an===v8||an===uY||an===aY,Gn=Rl.getClearColor(),jn=Rl.getClearAlpha(),tl=Gn.r,$t=Gn.g,Jn=Gn.b;Nn?(te[0]=tl,te[1]=$t,te[2]=Jn,te[3]=jn,Tt.clearBufferuiv(Tt.COLOR,0,te)):(he[0]=tl,he[1]=$t,he[2]=Jn,he[3]=jn,Tt.clearBufferiv(Tt.COLOR,0,he))}else ye|=Tt.COLOR_BUFFER_BIT}It&&(ye|=Tt.DEPTH_BUFFER_BIT),At&&(ye|=Tt.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Tt.clear(ye)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Jt,!1),n.removeEventListener("webglcontextrestored",ut,!1),n.removeEventListener("webglcontextcreationerror",Kt,!1),In.dispose(),bn.dispose(),sl.dispose(),We.dispose(),Dt.dispose(),Wt.dispose(),Zn.dispose(),Pl.dispose(),Sn.dispose(),En.dispose(),En.removeEventListener("sessionstart",us),En.removeEventListener("sessionend",bl),mn&&(mn.dispose(),mn=null),Es.stop()};function Jt(ke){ke.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),Ne=!0}function ut(){console.log("THREE.WebGLRenderer: Context Restored."),Ne=!1;const ke=Bl.autoReset,It=Gt.enabled,At=Gt.autoUpdate,ye=Gt.needsUpdate,pt=Gt.type;hn(),Bl.autoReset=ke,Gt.enabled=It,Gt.autoUpdate=At,Gt.needsUpdate=ye,Gt.type=pt}function Kt(ke){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",ke.statusMessage)}function tn(ke){const It=ke.target;It.removeEventListener("dispose",tn),nn(It)}function nn(ke){Bn(ke),sl.remove(ke)}function Bn(ke){const It=sl.get(ke).programs;It!==void 0&&(It.forEach(function(At){Sn.releaseProgram(At)}),ke.isShaderMaterial&&Sn.releaseShaderCache(ke))}this.renderBufferDirect=function(ke,It,At,ye,pt,an){It===null&&(It=yn);const Nn=pt.isMesh&&pt.matrixWorld.determinant()<0,Gn=g0(ke,It,At,ye,pt);wn.setMaterial(ye,Nn);let jn=At.index,tl=1;if(ye.wireframe===!0){if(jn=zt.getWireframeAttribute(At),jn===void 0)return;tl=2}const $t=At.drawRange,Jn=At.attributes.position;let Ul=$t.start*tl,Iu=($t.start+$t.count)*tl;an!==null&&(Ul=Math.max(Ul,an.start*tl),Iu=Math.min(Iu,(an.start+an.count)*tl)),jn!==null?(Ul=Math.max(Ul,0),Iu=Math.min(Iu,jn.count)):Jn!=null&&(Ul=Math.max(Ul,0),Iu=Math.min(Iu,Jn.count));const Ls=Iu-Ul;if(Ls<0||Ls===1/0)return;Zn.setup(pt,ye,Gn,At,jn);let Lu,vl=Vn;if(jn!==null&&(Lu=qt.get(jn),vl=gn,vl.setIndex(Lu)),pt.isMesh)ye.wireframe===!0?(wn.setLineWidth(ye.wireframeLinewidth*el()),vl.setMode(Tt.LINES)):vl.setMode(Tt.TRIANGLES);else if(pt.isLine){let rl=ye.linewidth;rl===void 0&&(rl=1),wn.setLineWidth(rl*el()),pt.isLineSegments?vl.setMode(Tt.LINES):pt.isLineLoop?vl.setMode(Tt.LINE_LOOP):vl.setMode(Tt.LINE_STRIP)}else pt.isPoints?vl.setMode(Tt.POINTS):pt.isSprite&&vl.setMode(Tt.TRIANGLES);if(pt.isBatchedMesh)vl.renderMultiDraw(pt._multiDrawStarts,pt._multiDrawCounts,pt._multiDrawCount);else if(pt.isInstancedMesh)vl.renderInstances(Ul,Ls,pt.count);else if(At.isInstancedBufferGeometry){const rl=At._maxInstanceCount!==void 0?At._maxInstanceCount:1/0,g3=Math.min(At.instanceCount,rl);vl.renderInstances(Ul,Ls,g3)}else vl.render(Ul,Ls)};function pn(ke,It,At){ke.transparent===!0&&ke.side===lp&&ke.forceSinglePass===!1?(ke.side=S3,ke.needsUpdate=!0,ai(ke,It,At),ke.side=fR,ke.needsUpdate=!0,ai(ke,It,At),ke.side=lp):ai(ke,It,At)}this.compile=function(ke,It,At=null){At===null&&(At=ke),oe=bn.get(At),oe.init(),Re.push(oe),At.traverseVisible(function(pt){pt.isLight&&pt.layers.test(It.layers)&&(oe.pushLight(pt),pt.castShadow&&oe.pushShadow(pt))}),ke!==At&&ke.traverseVisible(function(pt){pt.isLight&&pt.layers.test(It.layers)&&(oe.pushLight(pt),pt.castShadow&&oe.pushShadow(pt))}),oe.setupLights(Ie._useLegacyLights);const ye=new Set;return ke.traverse(function(pt){const an=pt.material;if(an)if(Array.isArray(an))for(let Nn=0;Nn<an.length;Nn++){const Gn=an[Nn];pn(Gn,At,pt),ye.add(Gn)}else pn(an,At,pt),ye.add(an)}),Re.pop(),oe=null,ye},this.compileAsync=function(ke,It,At=null){const ye=this.compile(ke,It,At);return new Promise(pt=>{function an(){if(ye.forEach(function(Nn){sl.get(Nn).currentProgram.isReady()&&ye.delete(Nn)}),ye.size===0){pt(ke);return}setTimeout(an,10)}Mn.get("KHR_parallel_shader_compile")!==null?an():setTimeout(an,10)})};let ql=null;function Ms(ke){ql&&ql(ke)}function us(){Es.stop()}function bl(){Es.start()}const Es=new SY;Es.setAnimationLoop(Ms),typeof self<"u"&&Es.setContext(self),this.setAnimationLoop=function(ke){ql=ke,En.setAnimationLoop(ke),ke===null?Es.stop():Es.start()},En.addEventListener("sessionstart",us),En.addEventListener("sessionend",bl),this.render=function(ke,It){if(It!==void 0&&It.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(Ne===!0)return;ke.matrixWorldAutoUpdate===!0&&ke.updateMatrixWorld(),It.parent===null&&It.matrixWorldAutoUpdate===!0&&It.updateMatrixWorld(),En.enabled===!0&&En.isPresenting===!0&&(En.cameraAutoUpdate===!0&&En.updateCamera(It),It=En.getCamera()),ke.isScene===!0&&ke.onBeforeRender(Ie,ke,It,Fe),oe=bn.get(ke,Re.length),oe.init(),Re.push(oe),An.multiplyMatrices(It.projectionMatrix,It.matrixWorldInverse),Lt.setFromProjectionMatrix(An),Xt=this.localClippingEnabled,Bt=Hn.init(this.clippingPlanes,Xt),de=In.get(ke,ie.length),de.init(),ie.push(de),Su(ke,It,0,Ie.sortObjects),de.finish(),Ie.sortObjects===!0&&de.sort(bt,Ct),this.info.render.frame++,Bt===!0&&Hn.beginShadows();const At=oe.state.shadowsArray;if(Gt.render(At,ke,It),Bt===!0&&Hn.endShadows(),this.info.autoReset===!0&&this.info.reset(),Rl.render(de,ke),oe.setupLights(Ie._useLegacyLights),It.isArrayCamera){const ye=It.cameras;for(let pt=0,an=ye.length;pt<an;pt++){const Nn=ye[pt];yd(de,ke,Nn,Nn.viewport)}}else yd(de,ke,It);Fe!==null&&(Ye.updateMultisampleRenderTarget(Fe),Ye.updateRenderTargetMipmap(Fe)),ke.isScene===!0&&ke.onAfterRender(Ie,ke,It),Zn.resetDefaultState(),Je=-1,ge=null,Re.pop(),Re.length>0?oe=Re[Re.length-1]:oe=null,ie.pop(),ie.length>0?de=ie[ie.length-1]:de=null};function Su(ke,It,At,ye){if(ke.visible===!1)return;if(ke.layers.test(It.layers)){if(ke.isGroup)At=ke.renderOrder;else if(ke.isLOD)ke.autoUpdate===!0&&ke.update(It);else if(ke.isLight)oe.pushLight(ke),ke.castShadow&&oe.pushShadow(ke);else if(ke.isSprite){if(!ke.frustumCulled||Lt.intersectsSprite(ke)){ye&&Fn.setFromMatrixPosition(ke.matrixWorld).applyMatrix4(An);const Nn=Wt.update(ke),Gn=ke.material;Gn.visible&&de.push(ke,Nn,Gn,At,Fn.z,null)}}else if((ke.isMesh||ke.isLine||ke.isPoints)&&(!ke.frustumCulled||Lt.intersectsObject(ke))){const Nn=Wt.update(ke),Gn=ke.material;if(ye&&(ke.boundingSphere!==void 0?(ke.boundingSphere===null&&ke.computeBoundingSphere(),Fn.copy(ke.boundingSphere.center)):(Nn.boundingSphere===null&&Nn.computeBoundingSphere(),Fn.copy(Nn.boundingSphere.center)),Fn.applyMatrix4(ke.matrixWorld).applyMatrix4(An)),Array.isArray(Gn)){const jn=Nn.groups;for(let tl=0,$t=jn.length;tl<$t;tl++){const Jn=jn[tl],Ul=Gn[Jn.materialIndex];Ul&&Ul.visible&&de.push(ke,Nn,Ul,At,Fn.z,Jn)}}else Gn.visible&&de.push(ke,Nn,Gn,At,Fn.z,null)}}const an=ke.children;for(let Nn=0,Gn=an.length;Nn<Gn;Nn++)Su(an[Nn],It,At,ye)}function yd(ke,It,At,ye){const pt=ke.opaque,an=ke.transmissive,Nn=ke.transparent;oe.setupLightsView(At),Bt===!0&&Hn.setGlobalState(Ie.clippingPlanes,At),an.length>0&&O3(pt,an,It,At),ye&&wn.viewport(Le.copy(ye)),pt.length>0&&uc(pt,It,At),an.length>0&&uc(an,It,At),Nn.length>0&&uc(Nn,It,At),wn.buffers.depth.setTest(!0),wn.buffers.depth.setMask(!0),wn.buffers.color.setMask(!0),wn.setPolygonOffset(!1)}function O3(ke,It,At,ye){if((At.isScene===!0?At.overrideMaterial:null)!==null)return;const an=_n.isWebGL2;mn===null&&(mn=new kN(1,1,{generateMipmaps:!0,type:Mn.has("EXT_color_buffer_half_float")?JH:jN,minFilter:ZH,samples:an?4:0})),Ie.getDrawingBufferSize(Un),an?mn.setSize(Un.x,Un.y):mn.setSize(hF(Un.x),hF(Un.y));const Nn=Ie.getRenderTarget();Ie.setRenderTarget(mn),Ie.getClearColor(ht),et=Ie.getClearAlpha(),et<1&&Ie.setClearColor(16777215,.5),Ie.clear();const Gn=Ie.toneMapping;Ie.toneMapping=WN,uc(ke,At,ye),Ye.updateMultisampleRenderTarget(mn),Ye.updateRenderTargetMipmap(mn);let jn=!1;for(let tl=0,$t=It.length;tl<$t;tl++){const Jn=It[tl],Ul=Jn.object,Iu=Jn.geometry,Ls=Jn.material,Lu=Jn.group;if(Ls.side===lp&&Ul.layers.test(ye.layers)){const vl=Ls.side;Ls.side=S3,Ls.needsUpdate=!0,L0(Ul,At,ye,Iu,Ls,Lu),Ls.side=vl,Ls.needsUpdate=!0,jn=!0}}jn===!0&&(Ye.updateMultisampleRenderTarget(mn),Ye.updateRenderTargetMipmap(mn)),Ie.setRenderTarget(Nn),Ie.setClearColor(ht,et),Ie.toneMapping=Gn}function uc(ke,It,At){const ye=It.isScene===!0?It.overrideMaterial:null;for(let pt=0,an=ke.length;pt<an;pt++){const Nn=ke[pt],Gn=Nn.object,jn=Nn.geometry,tl=ye===null?Nn.material:ye,$t=Nn.group;Gn.layers.test(At.layers)&&L0(Gn,It,At,jn,tl,$t)}}function L0(ke,It,At,ye,pt,an){ke.onBeforeRender(Ie,It,At,ye,pt,an),ke.modelViewMatrix.multiplyMatrices(At.matrixWorldInverse,ke.matrixWorld),ke.normalMatrix.getNormalMatrix(ke.modelViewMatrix),pt.onBeforeRender(Ie,It,At,ye,ke,an),pt.transparent===!0&&pt.side===lp&&pt.forceSinglePass===!1?(pt.side=S3,pt.needsUpdate=!0,Ie.renderBufferDirect(At,It,ye,pt,ke,an),pt.side=fR,pt.needsUpdate=!0,Ie.renderBufferDirect(At,It,ye,pt,ke,an),pt.side=lp):Ie.renderBufferDirect(At,It,ye,pt,ke,an),ke.onAfterRender(Ie,It,At,ye,pt,an)}function ai(ke,It,At){It.isScene!==!0&&(It=yn);const ye=sl.get(ke),pt=oe.state.lights,an=oe.state.shadowsArray,Nn=pt.state.version,Gn=Sn.getParameters(ke,pt.state,an,It,At),jn=Sn.getProgramCacheKey(Gn);let tl=ye.programs;ye.environment=ke.isMeshStandardMaterial?It.environment:null,ye.fog=It.fog,ye.envMap=(ke.isMeshStandardMaterial?Dt:We).get(ke.envMap||ye.environment),tl===void 0&&(ke.addEventListener("dispose",tn),tl=new Map,ye.programs=tl);let $t=tl.get(jn);if($t!==void 0){if(ye.currentProgram===$t&&ye.lightsStateVersion===Nn)return Wn(ke,Gn),$t}else Gn.uniforms=Sn.getUniforms(ke),ke.onBuild(At,Gn,Ie),ke.onBeforeCompile(Gn,Ie),$t=Sn.acquireProgram(Gn,jn),tl.set(jn,$t),ye.uniforms=Gn.uniforms;const Jn=ye.uniforms;return(!ke.isShaderMaterial&&!ke.isRawShaderMaterial||ke.clipping===!0)&&(Jn.clippingPlanes=Hn.uniform),Wn(ke,Gn),ye.needsLights=x2(ke),ye.lightsStateVersion=Nn,ye.needsLights&&(Jn.ambientLightColor.value=pt.state.ambient,Jn.lightProbe.value=pt.state.probe,Jn.directionalLights.value=pt.state.directional,Jn.directionalLightShadows.value=pt.state.directionalShadow,Jn.spotLights.value=pt.state.spot,Jn.spotLightShadows.value=pt.state.spotShadow,Jn.rectAreaLights.value=pt.state.rectArea,Jn.ltc_1.value=pt.state.rectAreaLTC1,Jn.ltc_2.value=pt.state.rectAreaLTC2,Jn.pointLights.value=pt.state.point,Jn.pointLightShadows.value=pt.state.pointShadow,Jn.hemisphereLights.value=pt.state.hemi,Jn.directionalShadowMap.value=pt.state.directionalShadowMap,Jn.directionalShadowMatrix.value=pt.state.directionalShadowMatrix,Jn.spotShadowMap.value=pt.state.spotShadowMap,Jn.spotLightMatrix.value=pt.state.spotLightMatrix,Jn.spotLightMap.value=pt.state.spotLightMap,Jn.pointShadowMap.value=pt.state.pointShadowMap,Jn.pointShadowMatrix.value=pt.state.pointShadowMatrix),ye.currentProgram=$t,ye.uniformsList=null,$t}function O0(ke){if(ke.uniformsList===null){const It=ke.currentProgram.getUniforms();ke.uniformsList=SU.seqWithValue(It.seq,ke.uniforms)}return ke.uniformsList}function Wn(ke,It){const At=sl.get(ke);At.outputColorSpace=It.outputColorSpace,At.batching=It.batching,At.instancing=It.instancing,At.instancingColor=It.instancingColor,At.skinning=It.skinning,At.morphTargets=It.morphTargets,At.morphNormals=It.morphNormals,At.morphColors=It.morphColors,At.morphTargetsCount=It.morphTargetsCount,At.numClippingPlanes=It.numClippingPlanes,At.numIntersection=It.numClipIntersection,At.vertexAlphas=It.vertexAlphas,At.vertexTangents=It.vertexTangents,At.toneMapping=It.toneMapping}function g0(ke,It,At,ye,pt){It.isScene!==!0&&(It=yn),Ye.resetTextureUnits();const an=It.fog,Nn=ye.isMeshStandardMaterial?It.environment:null,Gn=Fe===null?Ie.outputColorSpace:Fe.isXRRenderTarget===!0?Fe.texture.colorSpace:tm,jn=(ye.isMeshStandardMaterial?Dt:We).get(ye.envMap||Nn),tl=ye.vertexColors===!0&&!!At.attributes.color&&At.attributes.color.itemSize===4,$t=!!At.attributes.tangent&&(!!ye.normalMap||ye.anisotropy>0),Jn=!!At.morphAttributes.position,Ul=!!At.morphAttributes.normal,Iu=!!At.morphAttributes.color;let Ls=WN;ye.toneMapped&&(Fe===null||Fe.isXRRenderTarget===!0)&&(Ls=Ie.toneMapping);const Lu=At.morphAttributes.position||At.morphAttributes.normal||At.morphAttributes.color,vl=Lu!==void 0?Lu.length:0,rl=sl.get(ye),g3=oe.state.lights;if(Bt===!0&&(Xt===!0||ke!==ge)){const xs=ke===ge&&ye.id===Je;Hn.setState(ye,ke,xs)}let es=!1;ye.version===rl.__version?(rl.needsLights&&rl.lightsStateVersion!==g3.state.version||rl.outputColorSpace!==Gn||pt.isBatchedMesh&&rl.batching===!1||!pt.isBatchedMesh&&rl.batching===!0||pt.isInstancedMesh&&rl.instancing===!1||!pt.isInstancedMesh&&rl.instancing===!0||pt.isSkinnedMesh&&rl.skinning===!1||!pt.isSkinnedMesh&&rl.skinning===!0||pt.isInstancedMesh&&rl.instancingColor===!0&&pt.instanceColor===null||pt.isInstancedMesh&&rl.instancingColor===!1&&pt.instanceColor!==null||rl.envMap!==jn||ye.fog===!0&&rl.fog!==an||rl.numClippingPlanes!==void 0&&(rl.numClippingPlanes!==Hn.numPlanes||rl.numIntersection!==Hn.numIntersection)||rl.vertexAlphas!==tl||rl.vertexTangents!==$t||rl.morphTargets!==Jn||rl.morphNormals!==Ul||rl.morphColors!==Iu||rl.toneMapping!==Ls||_n.isWebGL2===!0&&rl.morphTargetsCount!==vl)&&(es=!0):(es=!0,rl.__version=ye.version);let Ou=rl.currentProgram;es===!0&&(Ou=ai(ye,It,pt));let P3=!1,Vc=!1,Ed=!1;const Os=Ou.getUniforms(),Zu=rl.uniforms;if(wn.useProgram(Ou.program)&&(P3=!0,Vc=!0,Ed=!0),ye.id!==Je&&(Je=ye.id,Vc=!0),P3||ge!==ke){Os.setValue(Tt,"projectionMatrix",ke.projectionMatrix),Os.setValue(Tt,"viewMatrix",ke.matrixWorldInverse);const xs=Os.map.cameraPosition;xs!==void 0&&xs.setValue(Tt,Fn.setFromMatrixPosition(ke.matrixWorld)),_n.logarithmicDepthBuffer&&Os.setValue(Tt,"logDepthBufFC",2/(Math.log(ke.far+1)/Math.LN2)),(ye.isMeshPhongMaterial||ye.isMeshToonMaterial||ye.isMeshLambertMaterial||ye.isMeshBasicMaterial||ye.isMeshStandardMaterial||ye.isShaderMaterial)&&Os.setValue(Tt,"isOrthographic",ke.isOrthographicCamera===!0),ge!==ke&&(ge=ke,Vc=!0,Ed=!0)}if(pt.isSkinnedMesh){Os.setOptional(Tt,pt,"bindMatrix"),Os.setOptional(Tt,pt,"bindMatrixInverse");const xs=pt.skeleton;xs&&(_n.floatVertexTextures?(xs.boneTexture===null&&xs.computeBoneTexture(),Os.setValue(Tt,"boneTexture",xs.boneTexture,Ye)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}pt.isBatchedMesh&&(Os.setOptional(Tt,pt,"batchingTexture"),Os.setValue(Tt,"batchingTexture",pt._matricesTexture,Ye));const ii=At.morphAttributes;if((ii.position!==void 0||ii.normal!==void 0||ii.color!==void 0&&_n.isWebGL2===!0)&&$n.update(pt,At,Ou),(Vc||rl.receiveShadow!==pt.receiveShadow)&&(rl.receiveShadow=pt.receiveShadow,Os.setValue(Tt,"receiveShadow",pt.receiveShadow)),ye.isMeshGouraudMaterial&&ye.envMap!==null&&(Zu.envMap.value=jn,Zu.flipEnvMap.value=jn.isCubeTexture&&jn.isRenderTargetTexture===!1?-1:1),Vc&&(Os.setValue(Tt,"toneMappingExposure",Ie.toneMappingExposure),rl.needsLights&&wd(Zu,Ed),an&&ye.fog===!0&&on.refreshFogUniforms(Zu,an),on.refreshMaterialUniforms(Zu,ye,Nt,ft,mn),SU.upload(Tt,O0(rl),Zu,Ye)),ye.isShaderMaterial&&ye.uniformsNeedUpdate===!0&&(SU.upload(Tt,O0(rl),Zu,Ye),ye.uniformsNeedUpdate=!1),ye.isSpriteMaterial&&Os.setValue(Tt,"center",pt.center),Os.setValue(Tt,"modelViewMatrix",pt.modelViewMatrix),Os.setValue(Tt,"normalMatrix",pt.normalMatrix),Os.setValue(Tt,"modelMatrix",pt.matrixWorld),ye.isShaderMaterial||ye.isRawShaderMaterial){const xs=ye.uniformsGroups;for(let Hs=0,Wc=xs.length;Hs<Wc;Hs++)if(_n.isWebGL2){const Td=xs[Hs];Pl.update(Td,Ou),Pl.bind(Td,Ou)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ou}function wd(ke,It){ke.ambientLightColor.needsUpdate=It,ke.lightProbe.needsUpdate=It,ke.directionalLights.needsUpdate=It,ke.directionalLightShadows.needsUpdate=It,ke.pointLights.needsUpdate=It,ke.pointLightShadows.needsUpdate=It,ke.spotLights.needsUpdate=It,ke.spotLightShadows.needsUpdate=It,ke.rectAreaLights.needsUpdate=It,ke.hemisphereLights.needsUpdate=It}function x2(ke){return ke.isMeshLambertMaterial||ke.isMeshToonMaterial||ke.isMeshPhongMaterial||ke.isMeshStandardMaterial||ke.isShadowMaterial||ke.isShaderMaterial&&ke.lights===!0}this.getActiveCubeFace=function(){return je},this.getActiveMipmapLevel=function(){return Be},this.getRenderTarget=function(){return Fe},this.setRenderTargetTextures=function(ke,It,At){sl.get(ke.texture).__webglTexture=It,sl.get(ke.depthTexture).__webglTexture=At;const ye=sl.get(ke);ye.__hasExternalTextures=!0,ye.__hasExternalTextures&&(ye.__autoAllocateDepthBuffer=At===void 0,ye.__autoAllocateDepthBuffer||Mn.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ye.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(ke,It){const At=sl.get(ke);At.__webglFramebuffer=It,At.__useDefaultFramebuffer=It===void 0},this.setRenderTarget=function(ke,It=0,At=0){Fe=ke,je=It,Be=At;let ye=!0,pt=null,an=!1,Nn=!1;if(ke){const jn=sl.get(ke);jn.__useDefaultFramebuffer!==void 0?(wn.bindFramebuffer(Tt.FRAMEBUFFER,null),ye=!1):jn.__webglFramebuffer===void 0?Ye.setupRenderTarget(ke):jn.__hasExternalTextures&&Ye.rebindTextures(ke,sl.get(ke.texture).__webglTexture,sl.get(ke.depthTexture).__webglTexture);const tl=ke.texture;(tl.isData3DTexture||tl.isDataArrayTexture||tl.isCompressedArrayTexture)&&(Nn=!0);const $t=sl.get(ke).__webglFramebuffer;ke.isWebGLCubeRenderTarget?(Array.isArray($t[It])?pt=$t[It][At]:pt=$t[It],an=!0):_n.isWebGL2&&ke.samples>0&&Ye.useMultisampledRTT(ke)===!1?pt=sl.get(ke).__webglMultisampledFramebuffer:Array.isArray($t)?pt=$t[At]:pt=$t,Le.copy(ke.viewport),Xe.copy(ke.scissor),lt=ke.scissorTest}else Le.copy(Ft).multiplyScalar(Nt).floor(),Xe.copy(Ht).multiplyScalar(Nt).floor(),lt=Ut;if(wn.bindFramebuffer(Tt.FRAMEBUFFER,pt)&&_n.drawBuffers&&ye&&wn.drawBuffers(ke,pt),wn.viewport(Le),wn.scissor(Xe),wn.setScissorTest(lt),an){const jn=sl.get(ke.texture);Tt.framebufferTexture2D(Tt.FRAMEBUFFER,Tt.COLOR_ATTACHMENT0,Tt.TEXTURE_CUBE_MAP_POSITIVE_X+It,jn.__webglTexture,At)}else if(Nn){const jn=sl.get(ke.texture),tl=It||0;Tt.framebufferTextureLayer(Tt.FRAMEBUFFER,Tt.COLOR_ATTACHMENT0,jn.__webglTexture,At||0,tl)}Je=-1},this.readRenderTargetPixels=function(ke,It,At,ye,pt,an,Nn){if(!(ke&&ke.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Gn=sl.get(ke).__webglFramebuffer;if(ke.isWebGLCubeRenderTarget&&Nn!==void 0&&(Gn=Gn[Nn]),Gn){wn.bindFramebuffer(Tt.FRAMEBUFFER,Gn);try{const jn=ke.texture,tl=jn.format,$t=jn.type;if(tl!==aE&&Tn.convert(tl)!==Tt.getParameter(Tt.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Jn=$t===JH&&(Mn.has("EXT_color_buffer_half_float")||_n.isWebGL2&&Mn.has("EXT_color_buffer_float"));if($t!==jN&&Tn.convert($t)!==Tt.getParameter(Tt.IMPLEMENTATION_COLOR_READ_TYPE)&&!($t===BN&&(_n.isWebGL2||Mn.has("OES_texture_float")||Mn.has("WEBGL_color_buffer_float")))&&!Jn){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}It>=0&&It<=ke.width-ye&&At>=0&&At<=ke.height-pt&&Tt.readPixels(It,At,ye,pt,Tn.convert(tl),Tn.convert($t),an)}finally{const jn=Fe!==null?sl.get(Fe).__webglFramebuffer:null;wn.bindFramebuffer(Tt.FRAMEBUFFER,jn)}}},this.copyFramebufferToTexture=function(ke,It,At=0){const ye=Math.pow(2,-At),pt=Math.floor(It.image.width*ye),an=Math.floor(It.image.height*ye);Ye.setTexture2D(It,0),Tt.copyTexSubImage2D(Tt.TEXTURE_2D,At,0,0,ke.x,ke.y,pt,an),wn.unbindTexture()},this.copyTextureToTexture=function(ke,It,At,ye=0){const pt=It.image.width,an=It.image.height,Nn=Tn.convert(At.format),Gn=Tn.convert(At.type);Ye.setTexture2D(At,0),Tt.pixelStorei(Tt.UNPACK_FLIP_Y_WEBGL,At.flipY),Tt.pixelStorei(Tt.UNPACK_PREMULTIPLY_ALPHA_WEBGL,At.premultiplyAlpha),Tt.pixelStorei(Tt.UNPACK_ALIGNMENT,At.unpackAlignment),It.isDataTexture?Tt.texSubImage2D(Tt.TEXTURE_2D,ye,ke.x,ke.y,pt,an,Nn,Gn,It.image.data):It.isCompressedTexture?Tt.compressedTexSubImage2D(Tt.TEXTURE_2D,ye,ke.x,ke.y,It.mipmaps[0].width,It.mipmaps[0].height,Nn,It.mipmaps[0].data):Tt.texSubImage2D(Tt.TEXTURE_2D,ye,ke.x,ke.y,Nn,Gn,It.image),ye===0&&At.generateMipmaps&&Tt.generateMipmap(Tt.TEXTURE_2D),wn.unbindTexture()},this.copyTextureToTexture3D=function(ke,It,At,ye,pt=0){if(Ie.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const an=ke.max.x-ke.min.x+1,Nn=ke.max.y-ke.min.y+1,Gn=ke.max.z-ke.min.z+1,jn=Tn.convert(ye.format),tl=Tn.convert(ye.type);let $t;if(ye.isData3DTexture)Ye.setTexture3D(ye,0),$t=Tt.TEXTURE_3D;else if(ye.isDataArrayTexture||ye.isCompressedArrayTexture)Ye.setTexture2DArray(ye,0),$t=Tt.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}Tt.pixelStorei(Tt.UNPACK_FLIP_Y_WEBGL,ye.flipY),Tt.pixelStorei(Tt.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ye.premultiplyAlpha),Tt.pixelStorei(Tt.UNPACK_ALIGNMENT,ye.unpackAlignment);const Jn=Tt.getParameter(Tt.UNPACK_ROW_LENGTH),Ul=Tt.getParameter(Tt.UNPACK_IMAGE_HEIGHT),Iu=Tt.getParameter(Tt.UNPACK_SKIP_PIXELS),Ls=Tt.getParameter(Tt.UNPACK_SKIP_ROWS),Lu=Tt.getParameter(Tt.UNPACK_SKIP_IMAGES),vl=At.isCompressedTexture?At.mipmaps[pt]:At.image;Tt.pixelStorei(Tt.UNPACK_ROW_LENGTH,vl.width),Tt.pixelStorei(Tt.UNPACK_IMAGE_HEIGHT,vl.height),Tt.pixelStorei(Tt.UNPACK_SKIP_PIXELS,ke.min.x),Tt.pixelStorei(Tt.UNPACK_SKIP_ROWS,ke.min.y),Tt.pixelStorei(Tt.UNPACK_SKIP_IMAGES,ke.min.z),At.isDataTexture||At.isData3DTexture?Tt.texSubImage3D($t,pt,It.x,It.y,It.z,an,Nn,Gn,jn,tl,vl.data):At.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),Tt.compressedTexSubImage3D($t,pt,It.x,It.y,It.z,an,Nn,Gn,jn,vl.data)):Tt.texSubImage3D($t,pt,It.x,It.y,It.z,an,Nn,Gn,jn,tl,vl),Tt.pixelStorei(Tt.UNPACK_ROW_LENGTH,Jn),Tt.pixelStorei(Tt.UNPACK_IMAGE_HEIGHT,Ul),Tt.pixelStorei(Tt.UNPACK_SKIP_PIXELS,Iu),Tt.pixelStorei(Tt.UNPACK_SKIP_ROWS,Ls),Tt.pixelStorei(Tt.UNPACK_SKIP_IMAGES,Lu),pt===0&&ye.generateMipmaps&&Tt.generateMipmap($t),wn.unbindTexture()},this.initTexture=function(ke){ke.isCubeTexture?Ye.setTextureCube(ke,0):ke.isData3DTexture?Ye.setTexture3D(ke,0):ke.isDataArrayTexture||ke.isCompressedArrayTexture?Ye.setTexture2DArray(ke,0):Ye.setTexture2D(ke,0),wn.unbindTexture()},this.resetState=function(){je=0,Be=0,Fe=null,wn.reset(),Zn.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return h7}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(l){this._outputColorSpace=l;const n=this.getContext();n.drawingBufferColorSpace=l===eV?"display-p3":"srgb",n.unpackColorSpace=qs.workingColorSpace===yF?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Qf?tL:fY}set outputEncoding(l){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=l===tL?Qf:tm}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(l){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=l}}class uJ extends rJ{}uJ.prototype.isWebGL1Renderer=!0;class fle extends vf{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(l,n){return super.copy(l,n),l.background!==null&&(this.background=l.background.clone()),l.environment!==null&&(this.environment=l.environment.clone()),l.fog!==null&&(this.fog=l.fog.clone()),this.backgroundBlurriness=l.backgroundBlurriness,this.backgroundIntensity=l.backgroundIntensity,l.overrideMaterial!==null&&(this.overrideMaterial=l.overrideMaterial.clone()),this.matrixAutoUpdate=l.matrixAutoUpdate,this}toJSON(l){const n=super.toJSON(l);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n}}class aJ{constructor(l,n){this.isInterleavedBuffer=!0,this.array=l,this.stride=n,this.count=l!==void 0?l.length/n:0,this.usage=d_,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=_7()}onUploadCallback(){}set needsUpdate(l){l===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(l){return this.usage=l,this}addUpdateRange(l,n){this.updateRanges.push({start:l,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(l){return this.array=new l.array.constructor(l.array),this.count=l.count,this.stride=l.stride,this.usage=l.usage,this}copyAt(l,n,t){l*=this.stride,t*=n.stride;for(let c=0,y=this.stride;c<y;c++)this.array[l+c]=n.array[t+c];return this}set(l,n=0){return this.array.set(l,n),this}clone(l){l.arrayBuffers===void 0&&(l.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_7()),l.arrayBuffers[this.array.buffer._uuid]===void 0&&(l.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(l.arrayBuffers[this.array.buffer._uuid]),t=new this.constructor(n,this.stride);return t.setUsage(this.usage),t}onUpload(l){return this.onUploadCallback=l,this}toJSON(l){return l.arrayBuffers===void 0&&(l.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_7()),l.arrayBuffers[this.array.buffer._uuid]===void 0&&(l.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const t3=new nt;class xY{constructor(l,n,t,c=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=l,this.itemSize=n,this.offset=t,this.normalized=c}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(l){this.data.needsUpdate=l}applyMatrix4(l){for(let n=0,t=this.data.count;n<t;n++)t3.fromBufferAttribute(this,n),t3.applyMatrix4(l),this.setXYZ(n,t3.x,t3.y,t3.z);return this}applyNormalMatrix(l){for(let n=0,t=this.count;n<t;n++)t3.fromBufferAttribute(this,n),t3.applyNormalMatrix(l),this.setXYZ(n,t3.x,t3.y,t3.z);return this}transformDirection(l){for(let n=0,t=this.count;n<t;n++)t3.fromBufferAttribute(this,n),t3.transformDirection(l),this.setXYZ(n,t3.x,t3.y,t3.z);return this}setX(l,n){return this.normalized&&(n=ks(n,this.array)),this.data.array[l*this.data.stride+this.offset]=n,this}setY(l,n){return this.normalized&&(n=ks(n,this.array)),this.data.array[l*this.data.stride+this.offset+1]=n,this}setZ(l,n){return this.normalized&&(n=ks(n,this.array)),this.data.array[l*this.data.stride+this.offset+2]=n,this}setW(l,n){return this.normalized&&(n=ks(n,this.array)),this.data.array[l*this.data.stride+this.offset+3]=n,this}getX(l){let n=this.data.array[l*this.data.stride+this.offset];return this.normalized&&(n=sp(n,this.array)),n}getY(l){let n=this.data.array[l*this.data.stride+this.offset+1];return this.normalized&&(n=sp(n,this.array)),n}getZ(l){let n=this.data.array[l*this.data.stride+this.offset+2];return this.normalized&&(n=sp(n,this.array)),n}getW(l){let n=this.data.array[l*this.data.stride+this.offset+3];return this.normalized&&(n=sp(n,this.array)),n}setXY(l,n,t){return l=l*this.data.stride+this.offset,this.normalized&&(n=ks(n,this.array),t=ks(t,this.array)),this.data.array[l+0]=n,this.data.array[l+1]=t,this}setXYZ(l,n,t,c){return l=l*this.data.stride+this.offset,this.normalized&&(n=ks(n,this.array),t=ks(t,this.array),c=ks(c,this.array)),this.data.array[l+0]=n,this.data.array[l+1]=t,this.data.array[l+2]=c,this}setXYZW(l,n,t,c,y){return l=l*this.data.stride+this.offset,this.normalized&&(n=ks(n,this.array),t=ks(t,this.array),c=ks(c,this.array),y=ks(y,this.array)),this.data.array[l+0]=n,this.data.array[l+1]=t,this.data.array[l+2]=c,this.data.array[l+3]=y,this}clone(l){if(l===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let t=0;t<this.count;t++){const c=t*this.data.stride+this.offset;for(let y=0;y<this.itemSize;y++)n.push(this.data.array[c+y])}return new eI(new this.array.constructor(n),this.itemSize,this.normalized)}else return l.interleavedBuffers===void 0&&(l.interleavedBuffers={}),l.interleavedBuffers[this.data.uuid]===void 0&&(l.interleavedBuffers[this.data.uuid]=this.data.clone(l)),new xY(l.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(l){if(l===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let t=0;t<this.count;t++){const c=t*this.data.stride+this.offset;for(let y=0;y<this.itemSize;y++)n.push(this.data.array[c+y])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return l.interleavedBuffers===void 0&&(l.interleavedBuffers={}),l.interleavedBuffers[this.data.uuid]===void 0&&(l.interleavedBuffers[this.data.uuid]=this.data.toJSON(l)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ile extends D0{constructor(l=null,n=1,t=1,c,y,A,g,U,_=Kf,Q=Kf,ee,J){super(null,A,g,U,_,Q,c,y,ee,J),this.isDataTexture=!0,this.image={data:l,width:n,height:t},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hj extends eI{constructor(l,n,t,c=1){super(l,n,t),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=c}copy(l){return super.copy(l),this.meshPerAttribute=l.meshPerAttribute,this}toJSON(){const l=super.toJSON();return l.meshPerAttribute=this.meshPerAttribute,l.isInstancedBufferAttribute=!0,l}}const VP=new Ll,fj=new Ll,tU=[],Ij=new rc,iJ=new Ll,nH=new w2,lH=new DO;class oJ extends w2{constructor(l,n,t){super(l,n),this.isInstancedMesh=!0,this.instanceMatrix=new hj(new Float32Array(t*16),16),this.instanceColor=null,this.count=t,this.boundingBox=null,this.boundingSphere=null;for(let c=0;c<t;c++)this.setMatrixAt(c,iJ)}computeBoundingBox(){const l=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new rc),l.boundingBox===null&&l.computeBoundingBox(),this.boundingBox.makeEmpty();for(let t=0;t<n;t++)this.getMatrixAt(t,VP),Ij.copy(l.boundingBox).applyMatrix4(VP),this.boundingBox.union(Ij)}computeBoundingSphere(){const l=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new DO),l.boundingSphere===null&&l.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let t=0;t<n;t++)this.getMatrixAt(t,VP),lH.copy(l.boundingSphere).applyMatrix4(VP),this.boundingSphere.union(lH)}copy(l,n){return super.copy(l,n),this.instanceMatrix.copy(l.instanceMatrix),l.instanceColor!==null&&(this.instanceColor=l.instanceColor.clone()),this.count=l.count,l.boundingBox!==null&&(this.boundingBox=l.boundingBox.clone()),l.boundingSphere!==null&&(this.boundingSphere=l.boundingSphere.clone()),this}getColorAt(l,n){n.fromArray(this.instanceColor.array,l*3)}getMatrixAt(l,n){n.fromArray(this.instanceMatrix.array,l*16)}raycast(l,n){const t=this.matrixWorld,c=this.count;if(nH.geometry=this.geometry,nH.material=this.material,nH.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),lH.copy(this.boundingSphere),lH.applyMatrix4(t),l.ray.intersectsSphere(lH)!==!1))for(let y=0;y<c;y++){this.getMatrixAt(y,VP),fj.multiplyMatrices(t,VP),nH.matrixWorld=fj,nH.raycast(l,tU);for(let A=0,g=tU.length;A<g;A++){const U=tU[A];U.instanceId=y,U.object=this,n.push(U)}tU.length=0}}setColorAt(l,n){this.instanceColor===null&&(this.instanceColor=new hj(new Float32Array(this.instanceMatrix.count*3),3)),n.toArray(this.instanceColor.array,l*3)}setMatrixAt(l,n){n.toArray(this.instanceMatrix.array,l*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class HY extends NO{constructor(l){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Sl(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(l)}copy(l){return super.copy(l),this.color.copy(l.color),this.map=l.map,this.linewidth=l.linewidth,this.linecap=l.linecap,this.linejoin=l.linejoin,this.fog=l.fog,this}}const dj=new nt,yj=new nt,wj=new Ll,YG=new wF,nU=new DO;class cJ extends vf{constructor(l=new nc,n=new HY){super(),this.isLine=!0,this.type="Line",this.geometry=l,this.material=n,this.updateMorphTargets()}copy(l,n){return super.copy(l,n),this.material=Array.isArray(l.material)?l.material.slice():l.material,this.geometry=l.geometry,this}computeLineDistances(){const l=this.geometry;if(l.index===null){const n=l.attributes.position,t=[0];for(let c=1,y=n.count;c<y;c++)dj.fromBufferAttribute(n,c-1),yj.fromBufferAttribute(n,c),t[c]=t[c-1],t[c]+=dj.distanceTo(yj);l.setAttribute("lineDistance",new $u(t,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(l,n){const t=this.geometry,c=this.matrixWorld,y=l.params.Line.threshold,A=t.drawRange;if(t.boundingSphere===null&&t.computeBoundingSphere(),nU.copy(t.boundingSphere),nU.applyMatrix4(c),nU.radius+=y,l.ray.intersectsSphere(nU)===!1)return;wj.copy(c).invert(),YG.copy(l.ray).applyMatrix4(wj);const g=y/((this.scale.x+this.scale.y+this.scale.z)/3),U=g*g,_=new nt,Q=new nt,ee=new nt,J=new nt,te=this.isLineSegments?2:1,he=t.index,oe=t.attributes.position;if(he!==null){const ie=Math.max(0,A.start),Re=Math.min(he.count,A.start+A.count);for(let Ie=ie,Ne=Re-1;Ie<Ne;Ie+=te){const je=he.getX(Ie),Be=he.getX(Ie+1);if(_.fromBufferAttribute(oe,je),Q.fromBufferAttribute(oe,Be),YG.distanceSqToSegment(_,Q,J,ee)>U)continue;J.applyMatrix4(this.matrixWorld);const Je=l.ray.origin.distanceTo(J);Je<l.near||Je>l.far||n.push({distance:Je,point:ee.clone().applyMatrix4(this.matrixWorld),index:Ie,face:null,faceIndex:null,object:this})}}else{const ie=Math.max(0,A.start),Re=Math.min(oe.count,A.start+A.count);for(let Ie=ie,Ne=Re-1;Ie<Ne;Ie+=te){if(_.fromBufferAttribute(oe,Ie),Q.fromBufferAttribute(oe,Ie+1),YG.distanceSqToSegment(_,Q,J,ee)>U)continue;J.applyMatrix4(this.matrixWorld);const Be=l.ray.origin.distanceTo(J);Be<l.near||Be>l.far||n.push({distance:Be,point:ee.clone().applyMatrix4(this.matrixWorld),index:Ie,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const n=this.geometry.morphAttributes,t=Object.keys(n);if(t.length>0){const c=n[t[0]];if(c!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let y=0,A=c.length;y<A;y++){const g=c[y].name||String(y);this.morphTargetInfluences.push(0),this.morphTargetDictionary[g]=y}}}}}const Ej=new nt,Tj=new nt;class hJ extends cJ{constructor(l,n){super(l,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const l=this.geometry;if(l.index===null){const n=l.attributes.position,t=[];for(let c=0,y=n.count;c<y;c+=2)Ej.fromBufferAttribute(n,c),Tj.fromBufferAttribute(n,c+1),t[c]=c===0?0:t[c-1],t[c+1]=t[c]+Ej.distanceTo(Tj);l.setAttribute("lineDistance",new $u(t,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class BY extends nc{constructor(l=1,n=1,t=1,c=32,y=1,A=!1,g=0,U=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:l,radiusBottom:n,height:t,radialSegments:c,heightSegments:y,openEnded:A,thetaStart:g,thetaLength:U};const _=this;c=Math.floor(c),y=Math.floor(y);const Q=[],ee=[],J=[],te=[];let he=0;const de=[],oe=t/2;let ie=0;Re(),A===!1&&(l>0&&Ie(!0),n>0&&Ie(!1)),this.setIndex(Q),this.setAttribute("position",new $u(ee,3)),this.setAttribute("normal",new $u(J,3)),this.setAttribute("uv",new $u(te,2));function Re(){const Ne=new nt,je=new nt;let Be=0;const Fe=(n-l)/t;for(let Je=0;Je<=y;Je++){const ge=[],Le=Je/y,Xe=Le*(n-l)+l;for(let lt=0;lt<=c;lt++){const ht=lt/c,et=ht*U+g,at=Math.sin(et),ft=Math.cos(et);je.x=Xe*at,je.y=-Le*t+oe,je.z=Xe*ft,ee.push(je.x,je.y,je.z),Ne.set(at,Fe,ft).normalize(),J.push(Ne.x,Ne.y,Ne.z),te.push(ht,1-Le),ge.push(he++)}de.push(ge)}for(let Je=0;Je<c;Je++)for(let ge=0;ge<y;ge++){const Le=de[ge][Je],Xe=de[ge+1][Je],lt=de[ge+1][Je+1],ht=de[ge][Je+1];Q.push(Le,Xe,ht),Q.push(Xe,lt,ht),Be+=6}_.addGroup(ie,Be,0),ie+=Be}function Ie(Ne){const je=he,Be=new Nl,Fe=new nt;let Je=0;const ge=Ne===!0?l:n,Le=Ne===!0?1:-1;for(let lt=1;lt<=c;lt++)ee.push(0,oe*Le,0),J.push(0,Le,0),te.push(.5,.5),he++;const Xe=he;for(let lt=0;lt<=c;lt++){const et=lt/c*U+g,at=Math.cos(et),ft=Math.sin(et);Fe.x=ge*ft,Fe.y=oe*Le,Fe.z=ge*at,ee.push(Fe.x,Fe.y,Fe.z),J.push(0,Le,0),Be.x=at*.5+.5,Be.y=ft*.5*Le+.5,te.push(Be.x,Be.y),he++}for(let lt=0;lt<c;lt++){const ht=je+lt,et=Xe+lt;Ne===!0?Q.push(et,et+1,ht):Q.push(et+1,et,ht),Je+=3}_.addGroup(ie,Je,Ne===!0?1:2),ie+=Je}}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}static fromJSON(l){return new BY(l.radiusTop,l.radiusBottom,l.height,l.radialSegments,l.heightSegments,l.openEnded,l.thetaStart,l.thetaLength)}}class uV extends nc{constructor(l=[],n=[],t=1,c=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:l,indices:n,radius:t,detail:c};const y=[],A=[];g(c),_(t),Q(),this.setAttribute("position",new $u(y,3)),this.setAttribute("normal",new $u(y.slice(),3)),this.setAttribute("uv",new $u(A,2)),c===0?this.computeVertexNormals():this.normalizeNormals();function g(Re){const Ie=new nt,Ne=new nt,je=new nt;for(let Be=0;Be<n.length;Be+=3)te(n[Be+0],Ie),te(n[Be+1],Ne),te(n[Be+2],je),U(Ie,Ne,je,Re)}function U(Re,Ie,Ne,je){const Be=je+1,Fe=[];for(let Je=0;Je<=Be;Je++){Fe[Je]=[];const ge=Re.clone().lerp(Ne,Je/Be),Le=Ie.clone().lerp(Ne,Je/Be),Xe=Be-Je;for(let lt=0;lt<=Xe;lt++)lt===0&&Je===Be?Fe[Je][lt]=ge:Fe[Je][lt]=ge.clone().lerp(Le,lt/Xe)}for(let Je=0;Je<Be;Je++)for(let ge=0;ge<2*(Be-Je)-1;ge++){const Le=Math.floor(ge/2);ge%2===0?(J(Fe[Je][Le+1]),J(Fe[Je+1][Le]),J(Fe[Je][Le])):(J(Fe[Je][Le+1]),J(Fe[Je+1][Le+1]),J(Fe[Je+1][Le]))}}function _(Re){const Ie=new nt;for(let Ne=0;Ne<y.length;Ne+=3)Ie.x=y[Ne+0],Ie.y=y[Ne+1],Ie.z=y[Ne+2],Ie.normalize().multiplyScalar(Re),y[Ne+0]=Ie.x,y[Ne+1]=Ie.y,y[Ne+2]=Ie.z}function Q(){const Re=new nt;for(let Ie=0;Ie<y.length;Ie+=3){Re.x=y[Ie+0],Re.y=y[Ie+1],Re.z=y[Ie+2];const Ne=oe(Re)/2/Math.PI+.5,je=ie(Re)/Math.PI+.5;A.push(Ne,1-je)}he(),ee()}function ee(){for(let Re=0;Re<A.length;Re+=6){const Ie=A[Re+0],Ne=A[Re+2],je=A[Re+4],Be=Math.max(Ie,Ne,je),Fe=Math.min(Ie,Ne,je);Be>.9&&Fe<.1&&(Ie<.2&&(A[Re+0]+=1),Ne<.2&&(A[Re+2]+=1),je<.2&&(A[Re+4]+=1))}}function J(Re){y.push(Re.x,Re.y,Re.z)}function te(Re,Ie){const Ne=Re*3;Ie.x=l[Ne+0],Ie.y=l[Ne+1],Ie.z=l[Ne+2]}function he(){const Re=new nt,Ie=new nt,Ne=new nt,je=new nt,Be=new Nl,Fe=new Nl,Je=new Nl;for(let ge=0,Le=0;ge<y.length;ge+=9,Le+=6){Re.set(y[ge+0],y[ge+1],y[ge+2]),Ie.set(y[ge+3],y[ge+4],y[ge+5]),Ne.set(y[ge+6],y[ge+7],y[ge+8]),Be.set(A[Le+0],A[Le+1]),Fe.set(A[Le+2],A[Le+3]),Je.set(A[Le+4],A[Le+5]),je.copy(Re).add(Ie).add(Ne).divideScalar(3);const Xe=oe(je);de(Be,Le+0,Re,Xe),de(Fe,Le+2,Ie,Xe),de(Je,Le+4,Ne,Xe)}}function de(Re,Ie,Ne,je){je<0&&Re.x===1&&(A[Ie]=Re.x-1),Ne.x===0&&Ne.z===0&&(A[Ie]=je/2/Math.PI+.5)}function oe(Re){return Math.atan2(Re.z,-Re.x)}function ie(Re){return Math.atan2(-Re.y,Math.sqrt(Re.x*Re.x+Re.z*Re.z))}}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}static fromJSON(l){return new uV(l.vertices,l.indices,l.radius,l.details)}}const lU=new nt,sU=new nt,zG=new nt,rU=new Zf;class fJ extends nc{constructor(l=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:l,thresholdAngle:n},l!==null){const c=Math.pow(10,4),y=Math.cos(Ob*n),A=l.getIndex(),g=l.getAttribute("position"),U=A?A.count:g.count,_=[0,0,0],Q=["a","b","c"],ee=new Array(3),J={},te=[];for(let he=0;he<U;he+=3){A?(_[0]=A.getX(he),_[1]=A.getX(he+1),_[2]=A.getX(he+2)):(_[0]=he,_[1]=he+1,_[2]=he+2);const{a:de,b:oe,c:ie}=rU;if(de.fromBufferAttribute(g,_[0]),oe.fromBufferAttribute(g,_[1]),ie.fromBufferAttribute(g,_[2]),rU.getNormal(zG),ee[0]=`${Math.round(de.x*c)},${Math.round(de.y*c)},${Math.round(de.z*c)}`,ee[1]=`${Math.round(oe.x*c)},${Math.round(oe.y*c)},${Math.round(oe.z*c)}`,ee[2]=`${Math.round(ie.x*c)},${Math.round(ie.y*c)},${Math.round(ie.z*c)}`,!(ee[0]===ee[1]||ee[1]===ee[2]||ee[2]===ee[0]))for(let Re=0;Re<3;Re++){const Ie=(Re+1)%3,Ne=ee[Re],je=ee[Ie],Be=rU[Q[Re]],Fe=rU[Q[Ie]],Je=`${Ne}_${je}`,ge=`${je}_${Ne}`;ge in J&&J[ge]?(zG.dot(J[ge].normal)<=y&&(te.push(Be.x,Be.y,Be.z),te.push(Fe.x,Fe.y,Fe.z)),J[ge]=null):Je in J||(J[Je]={index0:_[Re],index1:_[Ie],normal:zG.clone()})}}for(const he in J)if(J[he]){const{index0:de,index1:oe}=J[he];lU.fromBufferAttribute(g,de),sU.fromBufferAttribute(g,oe),te.push(lU.x,lU.y,lU.z),te.push(sU.x,sU.y,sU.z)}this.setAttribute("position",new $u(te,3))}}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}}const IJ={triangulate:function(e,l,n=2){const t=l&&l.length,c=t?l[0]*n:e.length;let y=UY(e,0,c,n,!0);const A=[];if(!y||y.next===y.prev)return A;let g,U,_,Q,ee,J,te;if(t&&(y=TJ(e,l,y,n)),e.length>80*n){g=_=e[0],U=Q=e[1];for(let he=n;he<c;he+=n)ee=e[he],J=e[he+1],ee<g&&(g=ee),J<U&&(U=J),ee>_&&(_=ee),J>Q&&(Q=J);te=Math.max(_-g,Q-U),te=te!==0?32767/te:0}return vH(y,A,n,g,U,te,0),A}};function UY(e,l,n,t,c){let y,A;if(c===PJ(e,l,n,t)>0)for(y=l;y<n;y+=t)A=pj(y,e[y],e[y+1],A);else for(y=n-t;y>=l;y-=t)A=pj(y,e[y],e[y+1],A);return A&&pF(A,A.next)&&(tB(A),A=A.next),A}function EL(e,l){if(!e)return e;l||(l=e);let n=e,t;do if(t=!1,!n.steiner&&(pF(n,n.next)||qu(n.prev,n,n.next)===0)){if(tB(n),n=l=n.prev,n===n.next)break;t=!0}else n=n.next;while(t||n!==l);return l}function vH(e,l,n,t,c,y,A){if(!e)return;!A&&y&&NJ(e,t,c,y);let g=e,U,_;for(;e.prev!==e.next;){if(U=e.prev,_=e.next,y?yJ(e,t,c,y):dJ(e)){l.push(U.i/n|0),l.push(e.i/n|0),l.push(_.i/n|0),tB(e),e=_.next,g=_.next;continue}if(e=_,e===g){A?A===1?(e=wJ(EL(e),l,n),vH(e,l,n,t,c,y,2)):A===2&&EJ(e,l,n,t,c,y):vH(EL(e),l,n,t,c,y,1);break}}}function dJ(e){const l=e.prev,n=e,t=e.next;if(qu(l,n,t)>=0)return!1;const c=l.x,y=n.x,A=t.x,g=l.y,U=n.y,_=t.y,Q=c<y?c<A?c:A:y<A?y:A,ee=g<U?g<_?g:_:U<_?U:_,J=c>y?c>A?c:A:y>A?y:A,te=g>U?g>_?g:_:U>_?U:_;let he=t.next;for(;he!==l;){if(he.x>=Q&&he.x<=J&&he.y>=ee&&he.y<=te&&Db(c,g,y,U,A,_,he.x,he.y)&&qu(he.prev,he,he.next)>=0)return!1;he=he.next}return!0}function yJ(e,l,n,t){const c=e.prev,y=e,A=e.next;if(qu(c,y,A)>=0)return!1;const g=c.x,U=y.x,_=A.x,Q=c.y,ee=y.y,J=A.y,te=g<U?g<_?g:_:U<_?U:_,he=Q<ee?Q<J?Q:J:ee<J?ee:J,de=g>U?g>_?g:_:U>_?U:_,oe=Q>ee?Q>J?Q:J:ee>J?ee:J,ie=T_(te,he,l,n,t),Re=T_(de,oe,l,n,t);let Ie=e.prevZ,Ne=e.nextZ;for(;Ie&&Ie.z>=ie&&Ne&&Ne.z<=Re;){if(Ie.x>=te&&Ie.x<=de&&Ie.y>=he&&Ie.y<=oe&&Ie!==c&&Ie!==A&&Db(g,Q,U,ee,_,J,Ie.x,Ie.y)&&qu(Ie.prev,Ie,Ie.next)>=0||(Ie=Ie.prevZ,Ne.x>=te&&Ne.x<=de&&Ne.y>=he&&Ne.y<=oe&&Ne!==c&&Ne!==A&&Db(g,Q,U,ee,_,J,Ne.x,Ne.y)&&qu(Ne.prev,Ne,Ne.next)>=0))return!1;Ne=Ne.nextZ}for(;Ie&&Ie.z>=ie;){if(Ie.x>=te&&Ie.x<=de&&Ie.y>=he&&Ie.y<=oe&&Ie!==c&&Ie!==A&&Db(g,Q,U,ee,_,J,Ie.x,Ie.y)&&qu(Ie.prev,Ie,Ie.next)>=0)return!1;Ie=Ie.prevZ}for(;Ne&&Ne.z<=Re;){if(Ne.x>=te&&Ne.x<=de&&Ne.y>=he&&Ne.y<=oe&&Ne!==c&&Ne!==A&&Db(g,Q,U,ee,_,J,Ne.x,Ne.y)&&qu(Ne.prev,Ne,Ne.next)>=0)return!1;Ne=Ne.nextZ}return!0}function wJ(e,l,n){let t=e;do{const c=t.prev,y=t.next.next;!pF(c,y)&&FY(c,t,t.next,y)&&eB(c,y)&&eB(y,c)&&(l.push(c.i/n|0),l.push(t.i/n|0),l.push(y.i/n|0),tB(t),tB(t.next),t=e=y),t=t.next}while(t!==e);return EL(t)}function EJ(e,l,n,t,c,y){let A=e;do{let g=A.next.next;for(;g!==A.prev;){if(A.i!==g.i&&LJ(A,g)){let U=GY(A,g);A=EL(A,A.next),U=EL(U,U.next),vH(A,l,n,t,c,y,0),vH(U,l,n,t,c,y,0);return}g=g.next}A=A.next}while(A!==e)}function TJ(e,l,n,t){const c=[];let y,A,g,U,_;for(y=0,A=l.length;y<A;y++)g=l[y]*t,U=y<A-1?l[y+1]*t:e.length,_=UY(e,g,U,t,!1),_===_.next&&(_.steiner=!0),c.push(SJ(_));for(c.sort(pJ),y=0;y<c.length;y++)n=RJ(c[y],n);return n}function pJ(e,l){return e.x-l.x}function RJ(e,l){const n=mJ(e,l);if(!n)return l;const t=GY(n,e);return EL(t,t.next),EL(n,n.next)}function mJ(e,l){let n=l,t=-1/0,c;const y=e.x,A=e.y;do{if(A<=n.y&&A>=n.next.y&&n.next.y!==n.y){const J=n.x+(A-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(J<=y&&J>t&&(t=J,c=n.x<n.next.x?n:n.next,J===y))return c}n=n.next}while(n!==l);if(!c)return null;const g=c,U=c.x,_=c.y;let Q=1/0,ee;n=c;do y>=n.x&&n.x>=U&&y!==n.x&&Db(A<_?y:t,A,U,_,A<_?t:y,A,n.x,n.y)&&(ee=Math.abs(A-n.y)/(y-n.x),eB(n,e)&&(ee<Q||ee===Q&&(n.x>c.x||n.x===c.x&&DJ(c,n)))&&(c=n,Q=ee)),n=n.next;while(n!==g);return c}function DJ(e,l){return qu(e.prev,e,l.prev)<0&&qu(l.next,e,e.next)<0}function NJ(e,l,n,t){let c=e;do c.z===0&&(c.z=T_(c.x,c.y,l,n,t)),c.prevZ=c.prev,c.nextZ=c.next,c=c.next;while(c!==e);c.prevZ.nextZ=null,c.prevZ=null,AJ(c)}function AJ(e){let l,n,t,c,y,A,g,U,_=1;do{for(n=e,e=null,y=null,A=0;n;){for(A++,t=n,g=0,l=0;l<_&&(g++,t=t.nextZ,!!t);l++);for(U=_;g>0||U>0&&t;)g!==0&&(U===0||!t||n.z<=t.z)?(c=n,n=n.nextZ,g--):(c=t,t=t.nextZ,U--),y?y.nextZ=c:e=c,c.prevZ=y,y=c;n=t}y.nextZ=null,_*=2}while(A>1);return e}function T_(e,l,n,t,c){return e=(e-n)*c|0,l=(l-t)*c|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,l=(l|l<<8)&16711935,l=(l|l<<4)&252645135,l=(l|l<<2)&858993459,l=(l|l<<1)&1431655765,e|l<<1}function SJ(e){let l=e,n=e;do(l.x<n.x||l.x===n.x&&l.y<n.y)&&(n=l),l=l.next;while(l!==e);return n}function Db(e,l,n,t,c,y,A,g){return(c-A)*(l-g)>=(e-A)*(y-g)&&(e-A)*(t-g)>=(n-A)*(l-g)&&(n-A)*(y-g)>=(c-A)*(t-g)}function LJ(e,l){return e.next.i!==l.i&&e.prev.i!==l.i&&!OJ(e,l)&&(eB(e,l)&&eB(l,e)&&gJ(e,l)&&(qu(e.prev,e,l.prev)||qu(e,l.prev,l))||pF(e,l)&&qu(e.prev,e,e.next)>0&&qu(l.prev,l,l.next)>0)}function qu(e,l,n){return(l.y-e.y)*(n.x-l.x)-(l.x-e.x)*(n.y-l.y)}function pF(e,l){return e.x===l.x&&e.y===l.y}function FY(e,l,n,t){const c=aU(qu(e,l,n)),y=aU(qu(e,l,t)),A=aU(qu(n,t,e)),g=aU(qu(n,t,l));return!!(c!==y&&A!==g||c===0&&uU(e,n,l)||y===0&&uU(e,t,l)||A===0&&uU(n,e,t)||g===0&&uU(n,l,t))}function uU(e,l,n){return l.x<=Math.max(e.x,n.x)&&l.x>=Math.min(e.x,n.x)&&l.y<=Math.max(e.y,n.y)&&l.y>=Math.min(e.y,n.y)}function aU(e){return e>0?1:e<0?-1:0}function OJ(e,l){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==l.i&&n.next.i!==l.i&&FY(n,n.next,e,l))return!0;n=n.next}while(n!==e);return!1}function eB(e,l){return qu(e.prev,e,e.next)<0?qu(e,l,e.next)>=0&&qu(e,e.prev,l)>=0:qu(e,l,e.prev)<0||qu(e,e.next,l)<0}function gJ(e,l){let n=e,t=!1;const c=(e.x+l.x)/2,y=(e.y+l.y)/2;do n.y>y!=n.next.y>y&&n.next.y!==n.y&&c<(n.next.x-n.x)*(y-n.y)/(n.next.y-n.y)+n.x&&(t=!t),n=n.next;while(n!==e);return t}function GY(e,l){const n=new p_(e.i,e.x,e.y),t=new p_(l.i,l.x,l.y),c=e.next,y=l.prev;return e.next=l,l.prev=e,n.next=c,c.prev=n,t.next=n,n.prev=t,y.next=t,t.prev=y,t}function pj(e,l,n,t){const c=new p_(e,l,n);return t?(c.next=t.next,c.prev=t,t.next.prev=c,t.next=c):(c.prev=c,c.next=c),c}function tB(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function p_(e,l,n){this.i=e,this.x=l,this.y=n,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function PJ(e,l,n,t){let c=0;for(let y=l,A=n-t;y<n;y+=t)c+=(e[A]-e[y])*(e[y+1]+e[A+1]),A=y;return c}class _Y{static area(l){const n=l.length;let t=0;for(let c=n-1,y=0;y<n;c=y++)t+=l[c].x*l[y].y-l[y].x*l[c].y;return t*.5}static isClockWise(l){return _Y.area(l)<0}static triangulateShape(l,n){const t=[],c=[],y=[];Rj(l),mj(t,l);let A=l.length;n.forEach(Rj);for(let U=0;U<n.length;U++)c.push(A),A+=n[U].length,mj(t,n[U]);const g=IJ.triangulate(t,c);for(let U=0;U<g.length;U+=3)y.push(g.slice(U,U+3));return y}}function Rj(e){const l=e.length;l>2&&e[l-1].equals(e[0])&&e.pop()}function mj(e,l){for(let n=0;n<l.length;n++)e.push(l[n].x),e.push(l[n].y)}class VY extends uV{constructor(l=1,n=0){const t=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],c=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(t,c,l,n),this.type="OctahedronGeometry",this.parameters={radius:l,detail:n}}static fromJSON(l){return new VY(l.radius,l.detail)}}class WY extends nc{constructor(l=1,n=32,t=16,c=0,y=Math.PI*2,A=0,g=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:l,widthSegments:n,heightSegments:t,phiStart:c,phiLength:y,thetaStart:A,thetaLength:g},n=Math.max(3,Math.floor(n)),t=Math.max(2,Math.floor(t));const U=Math.min(A+g,Math.PI);let _=0;const Q=[],ee=new nt,J=new nt,te=[],he=[],de=[],oe=[];for(let ie=0;ie<=t;ie++){const Re=[],Ie=ie/t;let Ne=0;ie===0&&A===0?Ne=.5/n:ie===t&&U===Math.PI&&(Ne=-.5/n);for(let je=0;je<=n;je++){const Be=je/n;ee.x=-l*Math.cos(c+Be*y)*Math.sin(A+Ie*g),ee.y=l*Math.cos(A+Ie*g),ee.z=l*Math.sin(c+Be*y)*Math.sin(A+Ie*g),he.push(ee.x,ee.y,ee.z),J.copy(ee).normalize(),de.push(J.x,J.y,J.z),oe.push(Be+Ne,1-Ie),Re.push(_++)}Q.push(Re)}for(let ie=0;ie<t;ie++)for(let Re=0;Re<n;Re++){const Ie=Q[ie][Re+1],Ne=Q[ie][Re],je=Q[ie+1][Re],Be=Q[ie+1][Re+1];(ie!==0||A>0)&&te.push(Ie,Ne,Be),(ie!==t-1||U<Math.PI)&&te.push(Ne,je,Be)}this.setIndex(te),this.setAttribute("position",new $u(he,3)),this.setAttribute("normal",new $u(de,3)),this.setAttribute("uv",new $u(oe,2))}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}static fromJSON(l){return new WY(l.radius,l.widthSegments,l.heightSegments,l.phiStart,l.phiLength,l.thetaStart,l.thetaLength)}}class jY extends nc{constructor(l=1,n=.4,t=12,c=48,y=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:l,tube:n,radialSegments:t,tubularSegments:c,arc:y},t=Math.floor(t),c=Math.floor(c);const A=[],g=[],U=[],_=[],Q=new nt,ee=new nt,J=new nt;for(let te=0;te<=t;te++)for(let he=0;he<=c;he++){const de=he/c*y,oe=te/t*Math.PI*2;ee.x=(l+n*Math.cos(oe))*Math.cos(de),ee.y=(l+n*Math.cos(oe))*Math.sin(de),ee.z=n*Math.sin(oe),g.push(ee.x,ee.y,ee.z),Q.x=l*Math.cos(de),Q.y=l*Math.sin(de),J.subVectors(ee,Q).normalize(),U.push(J.x,J.y,J.z),_.push(he/c),_.push(te/t)}for(let te=1;te<=t;te++)for(let he=1;he<=c;he++){const de=(c+1)*te+he-1,oe=(c+1)*(te-1)+he-1,ie=(c+1)*(te-1)+he,Re=(c+1)*te+he;A.push(de,oe,Re),A.push(oe,ie,Re)}this.setIndex(A),this.setAttribute("position",new $u(g,3)),this.setAttribute("normal",new $u(U,3)),this.setAttribute("uv",new $u(_,2))}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}static fromJSON(l){return new jY(l.radius,l.tube,l.radialSegments,l.tubularSegments,l.arc)}}class dle extends nc{constructor(l=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:l},l!==null){const n=[],t=new Set,c=new nt,y=new nt;if(l.index!==null){const A=l.attributes.position,g=l.index;let U=l.groups;U.length===0&&(U=[{start:0,count:g.count,materialIndex:0}]);for(let _=0,Q=U.length;_<Q;++_){const ee=U[_],J=ee.start,te=ee.count;for(let he=J,de=J+te;he<de;he+=3)for(let oe=0;oe<3;oe++){const ie=g.getX(he+oe),Re=g.getX(he+(oe+1)%3);c.fromBufferAttribute(A,ie),y.fromBufferAttribute(A,Re),Dj(c,y,t)===!0&&(n.push(c.x,c.y,c.z),n.push(y.x,y.y,y.z))}}}else{const A=l.attributes.position;for(let g=0,U=A.count/3;g<U;g++)for(let _=0;_<3;_++){const Q=3*g+_,ee=3*g+(_+1)%3;c.fromBufferAttribute(A,Q),y.fromBufferAttribute(A,ee),Dj(c,y,t)===!0&&(n.push(c.x,c.y,c.z),n.push(y.x,y.y,y.z))}}this.setAttribute("position",new $u(n,3))}}copy(l){return super.copy(l),this.parameters=Object.assign({},l.parameters),this}}function Dj(e,l,n){const t=`${e.x},${e.y},${e.z}-${l.x},${l.y},${l.z}`,c=`${l.x},${l.y},${l.z}-${e.x},${e.y},${e.z}`;return n.has(t)===!0||n.has(c)===!0?!1:(n.add(t),n.add(c),!0)}class yle extends NO{constructor(l){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Sl(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Sl(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=v_,this.normalScale=new Nl(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(l)}copy(l){return super.copy(l),this.defines={STANDARD:""},this.color.copy(l.color),this.roughness=l.roughness,this.metalness=l.metalness,this.map=l.map,this.lightMap=l.lightMap,this.lightMapIntensity=l.lightMapIntensity,this.aoMap=l.aoMap,this.aoMapIntensity=l.aoMapIntensity,this.emissive.copy(l.emissive),this.emissiveMap=l.emissiveMap,this.emissiveIntensity=l.emissiveIntensity,this.bumpMap=l.bumpMap,this.bumpScale=l.bumpScale,this.normalMap=l.normalMap,this.normalMapType=l.normalMapType,this.normalScale.copy(l.normalScale),this.displacementMap=l.displacementMap,this.displacementScale=l.displacementScale,this.displacementBias=l.displacementBias,this.roughnessMap=l.roughnessMap,this.metalnessMap=l.metalnessMap,this.alphaMap=l.alphaMap,this.envMap=l.envMap,this.envMapIntensity=l.envMapIntensity,this.wireframe=l.wireframe,this.wireframeLinewidth=l.wireframeLinewidth,this.wireframeLinecap=l.wireframeLinecap,this.wireframeLinejoin=l.wireframeLinejoin,this.flatShading=l.flatShading,this.fog=l.fog,this}}class bJ extends NO{constructor(l){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Sl(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Sl(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=v_,this.normalScale=new Nl(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=J_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(l)}copy(l){return super.copy(l),this.color.copy(l.color),this.map=l.map,this.lightMap=l.lightMap,this.lightMapIntensity=l.lightMapIntensity,this.aoMap=l.aoMap,this.aoMapIntensity=l.aoMapIntensity,this.emissive.copy(l.emissive),this.emissiveMap=l.emissiveMap,this.emissiveIntensity=l.emissiveIntensity,this.bumpMap=l.bumpMap,this.bumpScale=l.bumpScale,this.normalMap=l.normalMap,this.normalMapType=l.normalMapType,this.normalScale.copy(l.normalScale),this.displacementMap=l.displacementMap,this.displacementScale=l.displacementScale,this.displacementBias=l.displacementBias,this.specularMap=l.specularMap,this.alphaMap=l.alphaMap,this.envMap=l.envMap,this.combine=l.combine,this.reflectivity=l.reflectivity,this.refractionRatio=l.refractionRatio,this.wireframe=l.wireframe,this.wireframeLinewidth=l.wireframeLinewidth,this.wireframeLinecap=l.wireframeLinecap,this.wireframeLinejoin=l.wireframeLinejoin,this.flatShading=l.flatShading,this.fog=l.fog,this}}class YY extends vf{constructor(l,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Sl(l),this.intensity=n}dispose(){}copy(l,n){return super.copy(l,n),this.color.copy(l.color),this.intensity=l.intensity,this}toJSON(l){const n=super.toJSON(l);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),n}}const kG=new Ll,Nj=new nt,Aj=new nt;class CJ{constructor(l){this.camera=l,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Nl(512,512),this.map=null,this.mapPass=null,this.matrix=new Ll,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lV,this._frameExtents=new Nl(1,1),this._viewportCount=1,this._viewports=[new Gc(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(l){const n=this.camera,t=this.matrix;Nj.setFromMatrixPosition(l.matrixWorld),n.position.copy(Nj),Aj.setFromMatrixPosition(l.target.matrixWorld),n.lookAt(Aj),n.updateMatrixWorld(),kG.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kG),t.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),t.multiply(kG)}getViewport(l){return this._viewports[l]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(l){return this.camera=l.camera.clone(),this.bias=l.bias,this.radius=l.radius,this.mapSize.copy(l.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const l={};return this.bias!==0&&(l.bias=this.bias),this.normalBias!==0&&(l.normalBias=this.normalBias),this.radius!==1&&(l.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(l.mapSize=this.mapSize.toArray()),l.camera=this.camera.toJSON(!1).object,delete l.camera.matrix,l}}class MJ extends CJ{constructor(){super(new LY(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class wle extends YY{constructor(l,n){super(l,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vf.DEFAULT_UP),this.updateMatrix(),this.target=new vf,this.shadow=new MJ}dispose(){this.shadow.dispose()}copy(l){return super.copy(l),this.target=l.target.clone(),this.shadow=l.shadow.clone(),this}}class Ele extends YY{constructor(l,n){super(l,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class Tle extends nc{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(l){return super.copy(l),this.instanceCount=l.instanceCount,this}toJSON(){const l=super.toJSON();return l.instanceCount=this.instanceCount,l.isInstancedBufferGeometry=!0,l}}class ple{constructor(l=!0){this.autoStart=l,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Sj(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let l=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=Sj();l=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=l}return l}}function Sj(){return(typeof performance>"u"?Date:performance).now()}class Rle extends aJ{constructor(l,n,t=1){super(l,n),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=t}copy(l){return super.copy(l),this.meshPerAttribute=l.meshPerAttribute,this}clone(l){const n=super.clone(l);return n.meshPerAttribute=this.meshPerAttribute,n}toJSON(l){const n=super.toJSON(l);return n.isInstancedInterleavedBuffer=!0,n.meshPerAttribute=this.meshPerAttribute,n}}class mle{constructor(l,n,t=0,c=1/0){this.ray=new wF(l,n),this.near=t,this.far=c,this.camera=null,this.layers=new nV,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(l,n){this.ray.set(l,n)}setFromCamera(l,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(l.x,l.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(l.x,l.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}intersectObject(l,n=!0,t=[]){return R_(l,this,t,n),t.sort(Lj),t}intersectObjects(l,n=!0,t=[]){for(let c=0,y=l.length;c<y;c++)R_(l[c],this,t,n);return t.sort(Lj),t}}function Lj(e,l){return e.distance-l.distance}function R_(e,l,n,t){if(e.layers.test(l.layers)&&e.raycast(l,n),t===!0){const c=e.children;for(let y=0,A=c.length;y<A;y++)R_(c[y],l,n,!0)}}class Dle{constructor(l=1,n=0,t=0){return this.radius=l,this.phi=n,this.theta=t,this}set(l,n,t){return this.radius=l,this.phi=n,this.theta=t,this}copy(l){return this.radius=l.radius,this.phi=l.phi,this.theta=l.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(l){return this.setFromCartesianCoords(l.x,l.y,l.z)}setFromCartesianCoords(l,n,t){return this.radius=Math.sqrt(l*l+n*n+t*t),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(l,t),this.phi=Math.acos($f(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Oj=new nt,iU=new nt;class V7{constructor(l=new nt,n=new nt){this.start=l,this.end=n}set(l,n){return this.start.copy(l),this.end.copy(n),this}copy(l){return this.start.copy(l.start),this.end.copy(l.end),this}getCenter(l){return l.addVectors(this.start,this.end).multiplyScalar(.5)}delta(l){return l.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(l,n){return this.delta(n).multiplyScalar(l).add(this.start)}closestPointToPointParameter(l,n){Oj.subVectors(l,this.start),iU.subVectors(this.end,this.start);const t=iU.dot(iU);let y=iU.dot(Oj)/t;return n&&(y=$f(y,0,1)),y}closestPointToPoint(l,n,t){const c=this.closestPointToPointParameter(l,n);return this.delta(t).multiplyScalar(c).add(this.start)}applyMatrix4(l){return this.start.applyMatrix4(l),this.end.applyMatrix4(l),this}equals(l){return l.start.equals(this.start)&&l.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Z_}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Z_);var xJ=Object.getOwnPropertyNames,zY=(e,l)=>function(){return l||(0,e[xJ(e)[0]])((l={exports:{}}).exports,l),l.exports},HJ=zY({"dist/web-ifc-mt.js"(e,l){var n=(()=>{var t=typeof document<"u"&&document.currentScript?document.currentScript.src:void 0;return function(c={}){function y(){return ft.buffer!=Ut.buffer&&yn(),Ut}function A(){return ft.buffer!=Ut.buffer&&yn(),Lt}function g(){return ft.buffer!=Ut.buffer&&yn(),Bt}function U(){return ft.buffer!=Ut.buffer&&yn(),Xt}function _(){return ft.buffer!=Ut.buffer&&yn(),mn}function Q(){return ft.buffer!=Ut.buffer&&yn(),An}function ee(){return ft.buffer!=Ut.buffer&&yn(),Un}function J(){return ft.buffer!=Ut.buffer&&yn(),Fn}var te=c,he,de;te.ready=new Promise((b,Y)=>{he=b,de=Y});var oe=Object.assign({},te),ie="./this.program",Re=(b,Y)=>{throw Y},Ie=typeof window=="object",Ne=typeof importScripts=="function",je=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string",Be=te.ENVIRONMENT_IS_PTHREAD||!1,Fe="";function Je(b){return te.locateFile?te.locateFile(b,Fe):Fe+b}var ge,Le,Xe;(Ie||Ne)&&(Ne?Fe=self.location.href:typeof document<"u"&&document.currentScript&&(Fe=document.currentScript.src),t&&(Fe=t),Fe.indexOf("blob:")!==0?Fe=Fe.substr(0,Fe.replace(/[?#].*/,"").lastIndexOf("/")+1):Fe="",ge=b=>{var Y=new XMLHttpRequest;return Y.open("GET",b,!1),Y.send(null),Y.responseText},Ne&&(Xe=b=>{var Y=new XMLHttpRequest;return Y.open("GET",b,!1),Y.responseType="arraybuffer",Y.send(null),new Uint8Array(Y.response)}),Le=(b,Y,se)=>{var fe=new XMLHttpRequest;fe.open("GET",b,!0),fe.responseType="arraybuffer",fe.onload=()=>{if(fe.status==200||fe.status==0&&fe.response){Y(fe.response);return}se()},fe.onerror=se,fe.send(null)});var lt=te.print||console.log.bind(console),ht=te.printErr||console.error.bind(console);Object.assign(te,oe),oe=null,te.arguments&&te.arguments,te.thisProgram&&(ie=te.thisProgram),te.quit&&(Re=te.quit);var et;te.wasmBinary&&(et=te.wasmBinary);var at=te.noExitRuntime||!0;typeof WebAssembly!="object"&&Hn("no native wasm support detected");var ft,Nt,bt,Ct=!1,Ft;function Ht(b,Y){b||Hn(Y)}var Ut,Lt,Bt,Xt,mn,An,Un,Fn;function yn(){var b=ft.buffer;te.HEAP8=Ut=new Int8Array(b),te.HEAP16=Bt=new Int16Array(b),te.HEAP32=mn=new Int32Array(b),te.HEAPU8=Lt=new Uint8Array(b),te.HEAPU16=Xt=new Uint16Array(b),te.HEAPU32=An=new Uint32Array(b),te.HEAPF32=Un=new Float32Array(b),te.HEAPF64=Fn=new Float64Array(b)}var el=te.INITIAL_MEMORY||16777216;if(Ht(el>=5242880,"INITIAL_MEMORY should be larger than STACK_SIZE, was "+el+"! (STACK_SIZE=5242880)"),Be)ft=te.wasmMemory;else if(te.wasmMemory)ft=te.wasmMemory;else if(ft=new WebAssembly.Memory({initial:el/65536,maximum:65536,shared:!0}),!(ft.buffer instanceof SharedArrayBuffer))throw ht("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),je&&ht("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)"),Error("bad memory");yn(),el=ft.buffer.byteLength;var Tt,Xl=[],Mn=[],_n=[],wn=0;function Bl(){return at||wn>0}function sl(){if(te.preRun)for(typeof te.preRun=="function"&&(te.preRun=[te.preRun]);te.preRun.length;)Dt(te.preRun.shift());Jn(Xl)}function Ye(){Be||(!te.noFSInit&&!ye.init.initialized&&ye.init(),ye.ignorePermissions=!1,Jn(Mn))}function We(){if(!Be){if(te.postRun)for(typeof te.postRun=="function"&&(te.postRun=[te.postRun]);te.postRun.length;)zt(te.postRun.shift());Jn(_n)}}function Dt(b){Xl.unshift(b)}function qt(b){Mn.unshift(b)}function zt(b){_n.unshift(b)}var Wt=0,Sn=null;function on(b){return b}function In(b){Wt++,te.monitorRunDependencies&&te.monitorRunDependencies(Wt)}function bn(b){if(Wt--,te.monitorRunDependencies&&te.monitorRunDependencies(Wt),Wt==0&&Sn){var Y=Sn;Sn=null,Y()}}function Hn(b){te.onAbort&&te.onAbort(b),b="Aborted("+b+")",ht(b),Ct=!0,Ft=1,b+=". Build with -sASSERTIONS for more info.";var Y=new WebAssembly.RuntimeError(b);throw de(Y),Y}var Gt="data:application/octet-stream;base64,";function Rl(b){return b.startsWith(Gt)}var $n;$n="web-ifc-mt.wasm",Rl($n)||($n=Je($n));function Vn(b){if(b==$n&&et)return new Uint8Array(et);if(Xe)return Xe(b);throw"both async and sync fetching of the wasm failed"}function gn(b){return!et&&(Ie||Ne)&&typeof fetch=="function"?fetch(b,{credentials:"same-origin"}).then(Y=>{if(!Y.ok)throw"failed to load wasm binary file at '"+b+"'";return Y.arrayBuffer()}).catch(()=>Vn(b)):Promise.resolve().then(()=>Vn(b))}function Tn(b,Y,se){return gn(b).then(fe=>WebAssembly.instantiate(fe,Y)).then(fe=>fe).then(se,fe=>{ht("failed to asynchronously prepare wasm: "+fe),Hn(fe)})}function Zn(b,Y,se,fe){return!b&&typeof WebAssembly.instantiateStreaming=="function"&&!Rl(Y)&&typeof fetch=="function"?fetch(Y,{credentials:"same-origin"}).then(Pe=>{var ze=WebAssembly.instantiateStreaming(Pe,se);return ze.then(fe,function(Ke){return ht("wasm streaming compile failed: "+Ke),ht("falling back to ArrayBuffer instantiation"),Tn(Y,se,fe)})}):Tn(Y,se,fe)}function Pl(){var b={a:P0};function Y(fe,Pe){var ze=fe.exports;return ze=_2(ze),Nt=ze,rl(Nt.ma),Tt=Nt.ka,qt(Nt.ia),bt=Pe,bn(),ze}In();function se(fe){Y(fe.instance,fe.module)}if(te.instantiateWasm)try{return te.instantiateWasm(b,Y)}catch(fe){ht("Module.instantiateWasm callback failed with error: "+fe),de(fe)}return Zn(et,$n,b,se).catch(de),{}}var hn,En;function Jt(b){this.name="ExitStatus",this.message=`Program terminated with exit(${b})`,this.status=b}var ut=function(b){b.terminate(),b.onmessage=Y=>{}};function Kt(b){var Y=$t.pthreads[b];delete $t.pthreads[b],ut(Y),b0(b),$t.runningWorkers.splice($t.runningWorkers.indexOf(Y),1),Y.pthread_ptr=0}function tn(b){var Y=$t.pthreads[b];Y.postMessage({cmd:"cancel"})}function nn(b){var Y=$t.pthreads[b];Ht(Y),$t.returnWorkerToPool(Y)}function Bn(b){var Y=$t.getNewWorker();if(!Y)return 6;$t.runningWorkers.push(Y),$t.pthreads[b.pthread_ptr]=Y,Y.pthread_ptr=b.pthread_ptr;var se={cmd:"run",start_routine:b.startRoutine,arg:b.arg,pthread_ptr:b.pthread_ptr};return Y.postMessage(se,b.transferList),0}var pn={isAbs:b=>b.charAt(0)==="/",splitPath:b=>{var Y=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return Y.exec(b).slice(1)},normalizeArray:(b,Y)=>{for(var se=0,fe=b.length-1;fe>=0;fe--){var Pe=b[fe];Pe==="."?b.splice(fe,1):Pe===".."?(b.splice(fe,1),se++):se&&(b.splice(fe,1),se--)}if(Y)for(;se;se--)b.unshift("..");return b},normalize:b=>{var Y=pn.isAbs(b),se=b.substr(-1)==="/";return b=pn.normalizeArray(b.split("/").filter(fe=>!!fe),!Y).join("/"),!b&&!Y&&(b="."),b&&se&&(b+="/"),(Y?"/":"")+b},dirname:b=>{var Y=pn.splitPath(b),se=Y[0],fe=Y[1];return!se&&!fe?".":(fe&&(fe=fe.substr(0,fe.length-1)),se+fe)},basename:b=>{if(b==="/")return"/";b=pn.normalize(b),b=b.replace(/\/$/,"");var Y=b.lastIndexOf("/");return Y===-1?b:b.substr(Y+1)},join:function(){var b=Array.prototype.slice.call(arguments);return pn.normalize(b.join("/"))},join2:(b,Y)=>pn.normalize(b+"/"+Y)},ql=()=>{if(typeof crypto=="object"&&typeof crypto.getRandomValues=="function")return b=>(b.set(crypto.getRandomValues(new Uint8Array(b.byteLength))),b);Hn("initRandomDevice")},Ms=b=>(Ms=ql())(b),us={resolve:function(){for(var b="",Y=!1,se=arguments.length-1;se>=-1&&!Y;se--){var fe=se>=0?arguments[se]:ye.cwd();if(typeof fe!="string")throw new TypeError("Arguments to path.resolve must be strings");if(!fe)return"";b=fe+"/"+b,Y=pn.isAbs(fe)}return b=pn.normalizeArray(b.split("/").filter(Pe=>!!Pe),!Y).join("/"),(Y?"/":"")+b||"."},relative:(b,Y)=>{b=us.resolve(b).substr(1),Y=us.resolve(Y).substr(1);function se(mt){for(var Yt=0;Yt<mt.length&&mt[Yt]==="";Yt++);for(var cn=mt.length-1;cn>=0&&mt[cn]==="";cn--);return Yt>cn?[]:mt.slice(Yt,cn-Yt+1)}for(var fe=se(b.split("/")),Pe=se(Y.split("/")),ze=Math.min(fe.length,Pe.length),Ke=ze,$e=0;$e<ze;$e++)if(fe[$e]!==Pe[$e]){Ke=$e;break}for(var it=[],$e=Ke;$e<fe.length;$e++)it.push("..");return it=it.concat(Pe.slice(Ke)),it.join("/")}},bl=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0,Es=(b,Y,se)=>{Y>>>=0;for(var fe=Y+se,Pe=Y;b[Pe]&&!(Pe>=fe);)++Pe;if(Pe-Y>16&&b.buffer&&bl)return bl.decode(b.buffer instanceof SharedArrayBuffer?b.slice(Y,Pe):b.subarray(Y,Pe));for(var ze="";Y<Pe;){var Ke=b[Y++];if(!(Ke&128)){ze+=String.fromCharCode(Ke);continue}var $e=b[Y++]&63;if((Ke&224)==192){ze+=String.fromCharCode((Ke&31)<<6|$e);continue}var it=b[Y++]&63;if((Ke&240)==224?Ke=(Ke&15)<<12|$e<<6|it:Ke=(Ke&7)<<18|$e<<12|it<<6|b[Y++]&63,Ke<65536)ze+=String.fromCharCode(Ke);else{var mt=Ke-65536;ze+=String.fromCharCode(55296|mt>>10,56320|mt&1023)}}return ze},Su=[],yd=b=>{for(var Y=0,se=0;se<b.length;++se){var fe=b.charCodeAt(se);fe<=127?Y++:fe<=2047?Y+=2:fe>=55296&&fe<=57343?(Y+=4,++se):Y+=3}return Y},O3=(b,Y,se,fe)=>{if(se>>>=0,!(fe>0))return 0;for(var Pe=se,ze=se+fe-1,Ke=0;Ke<b.length;++Ke){var $e=b.charCodeAt(Ke);if($e>=55296&&$e<=57343){var it=b.charCodeAt(++Ke);$e=65536+(($e&1023)<<10)|it&1023}if($e<=127){if(se>=ze)break;Y[se++>>>0]=$e}else if($e<=2047){if(se+1>=ze)break;Y[se++>>>0]=192|$e>>6,Y[se++>>>0]=128|$e&63}else if($e<=65535){if(se+2>=ze)break;Y[se++>>>0]=224|$e>>12,Y[se++>>>0]=128|$e>>6&63,Y[se++>>>0]=128|$e&63}else{if(se+3>=ze)break;Y[se++>>>0]=240|$e>>18,Y[se++>>>0]=128|$e>>12&63,Y[se++>>>0]=128|$e>>6&63,Y[se++>>>0]=128|$e&63}}return Y[se>>>0]=0,se-Pe};function uc(b,Y,se){var fe=yd(b)+1,Pe=new Array(fe),ze=O3(b,Pe,0,Pe.length);return Y&&(Pe.length=ze),Pe}var L0=()=>{if(!Su.length){var b=null;if(typeof window<"u"&&typeof window.prompt=="function"?(b=window.prompt("Input: "),b!==null&&(b+=`
`)):typeof readline=="function"&&(b=readline(),b!==null&&(b+=`
`)),!b)return null;Su=uc(b,!0)}return Su.shift()},ai={ttys:[],init:function(){},shutdown:function(){},register:function(b,Y){ai.ttys[b]={input:[],output:[],ops:Y},ye.registerDevice(b,ai.stream_ops)},stream_ops:{open:function(b){var Y=ai.ttys[b.node.rdev];if(!Y)throw new ye.ErrnoError(43);b.tty=Y,b.seekable=!1},close:function(b){b.tty.ops.fsync(b.tty)},fsync:function(b){b.tty.ops.fsync(b.tty)},read:function(b,Y,se,fe,Pe){if(!b.tty||!b.tty.ops.get_char)throw new ye.ErrnoError(60);for(var ze=0,Ke=0;Ke<fe;Ke++){var $e;try{$e=b.tty.ops.get_char(b.tty)}catch{throw new ye.ErrnoError(29)}if($e===void 0&&ze===0)throw new ye.ErrnoError(6);if($e==null)break;ze++,Y[se+Ke]=$e}return ze&&(b.node.timestamp=Date.now()),ze},write:function(b,Y,se,fe,Pe){if(!b.tty||!b.tty.ops.put_char)throw new ye.ErrnoError(60);try{for(var ze=0;ze<fe;ze++)b.tty.ops.put_char(b.tty,Y[se+ze])}catch{throw new ye.ErrnoError(29)}return fe&&(b.node.timestamp=Date.now()),ze}},default_tty_ops:{get_char:function(b){return L0()},put_char:function(b,Y){Y===null||Y===10?(lt(Es(b.output,0)),b.output=[]):Y!=0&&b.output.push(Y)},fsync:function(b){b.output&&b.output.length>0&&(lt(Es(b.output,0)),b.output=[])},ioctl_tcgets:function(b){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets:function(b,Y,se){return 0},ioctl_tiocgwinsz:function(b){return[24,80]}},default_tty1_ops:{put_char:function(b,Y){Y===null||Y===10?(ht(Es(b.output,0)),b.output=[]):Y!=0&&b.output.push(Y)},fsync:function(b){b.output&&b.output.length>0&&(ht(Es(b.output,0)),b.output=[])}}},O0=b=>{Hn()},Wn={ops_table:null,mount(b){return Wn.createNode(null,"/",16895,0)},createNode(b,Y,se,fe){if(ye.isBlkdev(se)||ye.isFIFO(se))throw new ye.ErrnoError(63);Wn.ops_table||(Wn.ops_table={dir:{node:{getattr:Wn.node_ops.getattr,setattr:Wn.node_ops.setattr,lookup:Wn.node_ops.lookup,mknod:Wn.node_ops.mknod,rename:Wn.node_ops.rename,unlink:Wn.node_ops.unlink,rmdir:Wn.node_ops.rmdir,readdir:Wn.node_ops.readdir,symlink:Wn.node_ops.symlink},stream:{llseek:Wn.stream_ops.llseek}},file:{node:{getattr:Wn.node_ops.getattr,setattr:Wn.node_ops.setattr},stream:{llseek:Wn.stream_ops.llseek,read:Wn.stream_ops.read,write:Wn.stream_ops.write,allocate:Wn.stream_ops.allocate,mmap:Wn.stream_ops.mmap,msync:Wn.stream_ops.msync}},link:{node:{getattr:Wn.node_ops.getattr,setattr:Wn.node_ops.setattr,readlink:Wn.node_ops.readlink},stream:{}},chrdev:{node:{getattr:Wn.node_ops.getattr,setattr:Wn.node_ops.setattr},stream:ye.chrdev_stream_ops}});var Pe=ye.createNode(b,Y,se,fe);return ye.isDir(Pe.mode)?(Pe.node_ops=Wn.ops_table.dir.node,Pe.stream_ops=Wn.ops_table.dir.stream,Pe.contents={}):ye.isFile(Pe.mode)?(Pe.node_ops=Wn.ops_table.file.node,Pe.stream_ops=Wn.ops_table.file.stream,Pe.usedBytes=0,Pe.contents=null):ye.isLink(Pe.mode)?(Pe.node_ops=Wn.ops_table.link.node,Pe.stream_ops=Wn.ops_table.link.stream):ye.isChrdev(Pe.mode)&&(Pe.node_ops=Wn.ops_table.chrdev.node,Pe.stream_ops=Wn.ops_table.chrdev.stream),Pe.timestamp=Date.now(),b&&(b.contents[Y]=Pe,b.timestamp=Pe.timestamp),Pe},getFileDataAsTypedArray(b){return b.contents?b.contents.subarray?b.contents.subarray(0,b.usedBytes):new Uint8Array(b.contents):new Uint8Array(0)},expandFileStorage(b,Y){var se=b.contents?b.contents.length:0;if(!(se>=Y)){var fe=1024*1024;Y=Math.max(Y,se*(se<fe?2:1.125)>>>0),se!=0&&(Y=Math.max(Y,256));var Pe=b.contents;b.contents=new Uint8Array(Y),b.usedBytes>0&&b.contents.set(Pe.subarray(0,b.usedBytes),0)}},resizeFileStorage(b,Y){if(b.usedBytes!=Y)if(Y==0)b.contents=null,b.usedBytes=0;else{var se=b.contents;b.contents=new Uint8Array(Y),se&&b.contents.set(se.subarray(0,Math.min(Y,b.usedBytes))),b.usedBytes=Y}},node_ops:{getattr(b){var Y={};return Y.dev=ye.isChrdev(b.mode)?b.id:1,Y.ino=b.id,Y.mode=b.mode,Y.nlink=1,Y.uid=0,Y.gid=0,Y.rdev=b.rdev,ye.isDir(b.mode)?Y.size=4096:ye.isFile(b.mode)?Y.size=b.usedBytes:ye.isLink(b.mode)?Y.size=b.link.length:Y.size=0,Y.atime=new Date(b.timestamp),Y.mtime=new Date(b.timestamp),Y.ctime=new Date(b.timestamp),Y.blksize=4096,Y.blocks=Math.ceil(Y.size/Y.blksize),Y},setattr(b,Y){Y.mode!==void 0&&(b.mode=Y.mode),Y.timestamp!==void 0&&(b.timestamp=Y.timestamp),Y.size!==void 0&&Wn.resizeFileStorage(b,Y.size)},lookup(b,Y){throw ye.genericErrors[44]},mknod(b,Y,se,fe){return Wn.createNode(b,Y,se,fe)},rename(b,Y,se){if(ye.isDir(b.mode)){var fe;try{fe=ye.lookupNode(Y,se)}catch{}if(fe)for(var Pe in fe.contents)throw new ye.ErrnoError(55)}delete b.parent.contents[b.name],b.parent.timestamp=Date.now(),b.name=se,Y.contents[se]=b,Y.timestamp=b.parent.timestamp,b.parent=Y},unlink(b,Y){delete b.contents[Y],b.timestamp=Date.now()},rmdir(b,Y){var se=ye.lookupNode(b,Y);for(var fe in se.contents)throw new ye.ErrnoError(55);delete b.contents[Y],b.timestamp=Date.now()},readdir(b){var Y=[".",".."];for(var se in b.contents)b.contents.hasOwnProperty(se)&&Y.push(se);return Y},symlink(b,Y,se){var fe=Wn.createNode(b,Y,41471,0);return fe.link=se,fe},readlink(b){if(!ye.isLink(b.mode))throw new ye.ErrnoError(28);return b.link}},stream_ops:{read(b,Y,se,fe,Pe){var ze=b.node.contents;if(Pe>=b.node.usedBytes)return 0;var Ke=Math.min(b.node.usedBytes-Pe,fe);if(Ke>8&&ze.subarray)Y.set(ze.subarray(Pe,Pe+Ke),se);else for(var $e=0;$e<Ke;$e++)Y[se+$e]=ze[Pe+$e];return Ke},write(b,Y,se,fe,Pe,ze){if(Y.buffer===y().buffer&&(ze=!1),!fe)return 0;var Ke=b.node;if(Ke.timestamp=Date.now(),Y.subarray&&(!Ke.contents||Ke.contents.subarray)){if(ze)return Ke.contents=Y.subarray(se,se+fe),Ke.usedBytes=fe,fe;if(Ke.usedBytes===0&&Pe===0)return Ke.contents=Y.slice(se,se+fe),Ke.usedBytes=fe,fe;if(Pe+fe<=Ke.usedBytes)return Ke.contents.set(Y.subarray(se,se+fe),Pe),fe}if(Wn.expandFileStorage(Ke,Pe+fe),Ke.contents.subarray&&Y.subarray)Ke.contents.set(Y.subarray(se,se+fe),Pe);else for(var $e=0;$e<fe;$e++)Ke.contents[Pe+$e]=Y[se+$e];return Ke.usedBytes=Math.max(Ke.usedBytes,Pe+fe),fe},llseek(b,Y,se){var fe=Y;if(se===1?fe+=b.position:se===2&&ye.isFile(b.node.mode)&&(fe+=b.node.usedBytes),fe<0)throw new ye.ErrnoError(28);return fe},allocate(b,Y,se){Wn.expandFileStorage(b.node,Y+se),b.node.usedBytes=Math.max(b.node.usedBytes,Y+se)},mmap(b,Y,se,fe,Pe){if(!ye.isFile(b.node.mode))throw new ye.ErrnoError(43);var ze,Ke,$e=b.node.contents;if(!(Pe&2)&&$e.buffer===y().buffer)Ke=!1,ze=$e.byteOffset;else{if((se>0||se+Y<$e.length)&&($e.subarray?$e=$e.subarray(se,se+Y):$e=Array.prototype.slice.call($e,se,se+Y)),Ke=!0,ze=O0(),!ze)throw new ye.ErrnoError(48);y().set($e,ze>>>0)}return{ptr:ze,allocated:Ke}},msync(b,Y,se,fe,Pe){return Wn.stream_ops.write(b,Y,0,fe,se,!1),0}}},g0=(b,Y,se,fe)=>{var Pe=`al ${b}`;Le(b,ze=>{Ht(ze,`Loading data file "${b}" failed (no arrayBuffer).`),Y(new Uint8Array(ze)),Pe&&bn()},ze=>{if(se)se();else throw`Loading data file "${b}" failed.`}),Pe&&In()},wd=te.preloadPlugins||[];function x2(b,Y,se,fe){typeof Browser<"u"&&Browser.init();var Pe=!1;return wd.forEach(function(ze){Pe||ze.canHandle(Y)&&(ze.handle(b,Y,se,fe),Pe=!0)}),Pe}function ke(b,Y,se,fe,Pe,ze,Ke,$e,it,mt){var Yt=Y?us.resolve(pn.join2(b,Y)):b;function cn(Zt){function sn(Cn){mt&&mt(),$e||ye.createDataFile(b,Y,Cn,fe,Pe,it),ze&&ze(),bn()}x2(Zt,Yt,sn,()=>{Ke&&Ke(),bn()})||sn(Zt)}In(),typeof se=="string"?g0(se,Zt=>cn(Zt),Ke):cn(se)}function It(b){var Y={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},se=Y[b];if(typeof se>"u")throw new Error(`Unknown file open mode: ${b}`);return se}function At(b,Y){var se=0;return b&&(se|=365),Y&&(se|=146),se}var ye={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:(b,Y={})=>{if(b=us.resolve(b),!b)return{path:"",node:null};var se={follow_mount:!0,recurse_count:0};if(Y=Object.assign(se,Y),Y.recurse_count>8)throw new ye.ErrnoError(32);for(var fe=b.split("/").filter(cn=>!!cn),Pe=ye.root,ze="/",Ke=0;Ke<fe.length;Ke++){var $e=Ke===fe.length-1;if($e&&Y.parent)break;if(Pe=ye.lookupNode(Pe,fe[Ke]),ze=pn.join2(ze,fe[Ke]),ye.isMountpoint(Pe)&&(!$e||$e&&Y.follow_mount)&&(Pe=Pe.mounted.root),!$e||Y.follow)for(var it=0;ye.isLink(Pe.mode);){var mt=ye.readlink(ze);ze=us.resolve(pn.dirname(ze),mt);var Yt=ye.lookupPath(ze,{recurse_count:Y.recurse_count+1});if(Pe=Yt.node,it++>40)throw new ye.ErrnoError(32)}}return{path:ze,node:Pe}},getPath:b=>{for(var Y;;){if(ye.isRoot(b)){var se=b.mount.mountpoint;return Y?se[se.length-1]!=="/"?`${se}/${Y}`:se+Y:se}Y=Y?`${b.name}/${Y}`:b.name,b=b.parent}},hashName:(b,Y)=>{for(var se=0,fe=0;fe<Y.length;fe++)se=(se<<5)-se+Y.charCodeAt(fe)|0;return(b+se>>>0)%ye.nameTable.length},hashAddNode:b=>{var Y=ye.hashName(b.parent.id,b.name);b.name_next=ye.nameTable[Y],ye.nameTable[Y]=b},hashRemoveNode:b=>{var Y=ye.hashName(b.parent.id,b.name);if(ye.nameTable[Y]===b)ye.nameTable[Y]=b.name_next;else for(var se=ye.nameTable[Y];se;){if(se.name_next===b){se.name_next=b.name_next;break}se=se.name_next}},lookupNode:(b,Y)=>{var se=ye.mayLookup(b);if(se)throw new ye.ErrnoError(se,b);for(var fe=ye.hashName(b.id,Y),Pe=ye.nameTable[fe];Pe;Pe=Pe.name_next){var ze=Pe.name;if(Pe.parent.id===b.id&&ze===Y)return Pe}return ye.lookup(b,Y)},createNode:(b,Y,se,fe)=>{var Pe=new ye.FSNode(b,Y,se,fe);return ye.hashAddNode(Pe),Pe},destroyNode:b=>{ye.hashRemoveNode(b)},isRoot:b=>b===b.parent,isMountpoint:b=>!!b.mounted,isFile:b=>(b&61440)===32768,isDir:b=>(b&61440)===16384,isLink:b=>(b&61440)===40960,isChrdev:b=>(b&61440)===8192,isBlkdev:b=>(b&61440)===24576,isFIFO:b=>(b&61440)===4096,isSocket:b=>(b&49152)===49152,flagsToPermissionString:b=>{var Y=["r","w","rw"][b&3];return b&512&&(Y+="w"),Y},nodePermissions:(b,Y)=>ye.ignorePermissions?0:Y.includes("r")&&!(b.mode&292)||Y.includes("w")&&!(b.mode&146)||Y.includes("x")&&!(b.mode&73)?2:0,mayLookup:b=>{var Y=ye.nodePermissions(b,"x");return Y||(b.node_ops.lookup?0:2)},mayCreate:(b,Y)=>{try{var se=ye.lookupNode(b,Y);return 20}catch{}return ye.nodePermissions(b,"wx")},mayDelete:(b,Y,se)=>{var fe;try{fe=ye.lookupNode(b,Y)}catch(ze){return ze.errno}var Pe=ye.nodePermissions(b,"wx");if(Pe)return Pe;if(se){if(!ye.isDir(fe.mode))return 54;if(ye.isRoot(fe)||ye.getPath(fe)===ye.cwd())return 10}else if(ye.isDir(fe.mode))return 31;return 0},mayOpen:(b,Y)=>b?ye.isLink(b.mode)?32:ye.isDir(b.mode)&&(ye.flagsToPermissionString(Y)!=="r"||Y&512)?31:ye.nodePermissions(b,ye.flagsToPermissionString(Y)):44,MAX_OPEN_FDS:4096,nextfd:()=>{for(var b=0;b<=ye.MAX_OPEN_FDS;b++)if(!ye.streams[b])return b;throw new ye.ErrnoError(33)},getStreamChecked:b=>{var Y=ye.getStream(b);if(!Y)throw new ye.ErrnoError(8);return Y},getStream:b=>ye.streams[b],createStream:(b,Y=-1)=>(ye.FSStream||(ye.FSStream=function(){this.shared={}},ye.FSStream.prototype={},Object.defineProperties(ye.FSStream.prototype,{object:{get(){return this.node},set(se){this.node=se}},isRead:{get(){return(this.flags&2097155)!==1}},isWrite:{get(){return(this.flags&2097155)!==0}},isAppend:{get(){return this.flags&1024}},flags:{get(){return this.shared.flags},set(se){this.shared.flags=se}},position:{get(){return this.shared.position},set(se){this.shared.position=se}}})),b=Object.assign(new ye.FSStream,b),Y==-1&&(Y=ye.nextfd()),b.fd=Y,ye.streams[Y]=b,b),closeStream:b=>{ye.streams[b]=null},chrdev_stream_ops:{open:b=>{var Y=ye.getDevice(b.node.rdev);b.stream_ops=Y.stream_ops,b.stream_ops.open&&b.stream_ops.open(b)},llseek:()=>{throw new ye.ErrnoError(70)}},major:b=>b>>8,minor:b=>b&255,makedev:(b,Y)=>b<<8|Y,registerDevice:(b,Y)=>{ye.devices[b]={stream_ops:Y}},getDevice:b=>ye.devices[b],getMounts:b=>{for(var Y=[],se=[b];se.length;){var fe=se.pop();Y.push(fe),se.push.apply(se,fe.mounts)}return Y},syncfs:(b,Y)=>{typeof b=="function"&&(Y=b,b=!1),ye.syncFSRequests++,ye.syncFSRequests>1&&ht(`warning: ${ye.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);var se=ye.getMounts(ye.root.mount),fe=0;function Pe(Ke){return ye.syncFSRequests--,Y(Ke)}function ze(Ke){if(Ke)return ze.errored?void 0:(ze.errored=!0,Pe(Ke));++fe>=se.length&&Pe(null)}se.forEach(Ke=>{if(!Ke.type.syncfs)return ze(null);Ke.type.syncfs(Ke,b,ze)})},mount:(b,Y,se)=>{var fe=se==="/",Pe=!se,ze;if(fe&&ye.root)throw new ye.ErrnoError(10);if(!fe&&!Pe){var Ke=ye.lookupPath(se,{follow_mount:!1});if(se=Ke.path,ze=Ke.node,ye.isMountpoint(ze))throw new ye.ErrnoError(10);if(!ye.isDir(ze.mode))throw new ye.ErrnoError(54)}var $e={type:b,opts:Y,mountpoint:se,mounts:[]},it=b.mount($e);return it.mount=$e,$e.root=it,fe?ye.root=it:ze&&(ze.mounted=$e,ze.mount&&ze.mount.mounts.push($e)),it},unmount:b=>{var Y=ye.lookupPath(b,{follow_mount:!1});if(!ye.isMountpoint(Y.node))throw new ye.ErrnoError(28);var se=Y.node,fe=se.mounted,Pe=ye.getMounts(fe);Object.keys(ye.nameTable).forEach(Ke=>{for(var $e=ye.nameTable[Ke];$e;){var it=$e.name_next;Pe.includes($e.mount)&&ye.destroyNode($e),$e=it}}),se.mounted=null;var ze=se.mount.mounts.indexOf(fe);se.mount.mounts.splice(ze,1)},lookup:(b,Y)=>b.node_ops.lookup(b,Y),mknod:(b,Y,se)=>{var fe=ye.lookupPath(b,{parent:!0}),Pe=fe.node,ze=pn.basename(b);if(!ze||ze==="."||ze==="..")throw new ye.ErrnoError(28);var Ke=ye.mayCreate(Pe,ze);if(Ke)throw new ye.ErrnoError(Ke);if(!Pe.node_ops.mknod)throw new ye.ErrnoError(63);return Pe.node_ops.mknod(Pe,ze,Y,se)},create:(b,Y)=>(Y=Y!==void 0?Y:438,Y&=4095,Y|=32768,ye.mknod(b,Y,0)),mkdir:(b,Y)=>(Y=Y!==void 0?Y:511,Y&=1023,Y|=16384,ye.mknod(b,Y,0)),mkdirTree:(b,Y)=>{for(var se=b.split("/"),fe="",Pe=0;Pe<se.length;++Pe)if(se[Pe]){fe+="/"+se[Pe];try{ye.mkdir(fe,Y)}catch(ze){if(ze.errno!=20)throw ze}}},mkdev:(b,Y,se)=>(typeof se>"u"&&(se=Y,Y=438),Y|=8192,ye.mknod(b,Y,se)),symlink:(b,Y)=>{if(!us.resolve(b))throw new ye.ErrnoError(44);var se=ye.lookupPath(Y,{parent:!0}),fe=se.node;if(!fe)throw new ye.ErrnoError(44);var Pe=pn.basename(Y),ze=ye.mayCreate(fe,Pe);if(ze)throw new ye.ErrnoError(ze);if(!fe.node_ops.symlink)throw new ye.ErrnoError(63);return fe.node_ops.symlink(fe,Pe,b)},rename:(b,Y)=>{var se=pn.dirname(b),fe=pn.dirname(Y),Pe=pn.basename(b),ze=pn.basename(Y),Ke,$e,it;if(Ke=ye.lookupPath(b,{parent:!0}),$e=Ke.node,Ke=ye.lookupPath(Y,{parent:!0}),it=Ke.node,!$e||!it)throw new ye.ErrnoError(44);if($e.mount!==it.mount)throw new ye.ErrnoError(75);var mt=ye.lookupNode($e,Pe),Yt=us.relative(b,fe);if(Yt.charAt(0)!==".")throw new ye.ErrnoError(28);if(Yt=us.relative(Y,se),Yt.charAt(0)!==".")throw new ye.ErrnoError(55);var cn;try{cn=ye.lookupNode(it,ze)}catch{}if(mt!==cn){var Zt=ye.isDir(mt.mode),sn=ye.mayDelete($e,Pe,Zt);if(sn)throw new ye.ErrnoError(sn);if(sn=cn?ye.mayDelete(it,ze,Zt):ye.mayCreate(it,ze),sn)throw new ye.ErrnoError(sn);if(!$e.node_ops.rename)throw new ye.ErrnoError(63);if(ye.isMountpoint(mt)||cn&&ye.isMountpoint(cn))throw new ye.ErrnoError(10);if(it!==$e&&(sn=ye.nodePermissions($e,"w"),sn))throw new ye.ErrnoError(sn);ye.hashRemoveNode(mt);try{$e.node_ops.rename(mt,it,ze)}catch(Cn){throw Cn}finally{ye.hashAddNode(mt)}}},rmdir:b=>{var Y=ye.lookupPath(b,{parent:!0}),se=Y.node,fe=pn.basename(b),Pe=ye.lookupNode(se,fe),ze=ye.mayDelete(se,fe,!0);if(ze)throw new ye.ErrnoError(ze);if(!se.node_ops.rmdir)throw new ye.ErrnoError(63);if(ye.isMountpoint(Pe))throw new ye.ErrnoError(10);se.node_ops.rmdir(se,fe),ye.destroyNode(Pe)},readdir:b=>{var Y=ye.lookupPath(b,{follow:!0}),se=Y.node;if(!se.node_ops.readdir)throw new ye.ErrnoError(54);return se.node_ops.readdir(se)},unlink:b=>{var Y=ye.lookupPath(b,{parent:!0}),se=Y.node;if(!se)throw new ye.ErrnoError(44);var fe=pn.basename(b),Pe=ye.lookupNode(se,fe),ze=ye.mayDelete(se,fe,!1);if(ze)throw new ye.ErrnoError(ze);if(!se.node_ops.unlink)throw new ye.ErrnoError(63);if(ye.isMountpoint(Pe))throw new ye.ErrnoError(10);se.node_ops.unlink(se,fe),ye.destroyNode(Pe)},readlink:b=>{var Y=ye.lookupPath(b),se=Y.node;if(!se)throw new ye.ErrnoError(44);if(!se.node_ops.readlink)throw new ye.ErrnoError(28);return us.resolve(ye.getPath(se.parent),se.node_ops.readlink(se))},stat:(b,Y)=>{var se=ye.lookupPath(b,{follow:!Y}),fe=se.node;if(!fe)throw new ye.ErrnoError(44);if(!fe.node_ops.getattr)throw new ye.ErrnoError(63);return fe.node_ops.getattr(fe)},lstat:b=>ye.stat(b,!0),chmod:(b,Y,se)=>{var fe;if(typeof b=="string"){var Pe=ye.lookupPath(b,{follow:!se});fe=Pe.node}else fe=b;if(!fe.node_ops.setattr)throw new ye.ErrnoError(63);fe.node_ops.setattr(fe,{mode:Y&4095|fe.mode&-4096,timestamp:Date.now()})},lchmod:(b,Y)=>{ye.chmod(b,Y,!0)},fchmod:(b,Y)=>{var se=ye.getStreamChecked(b);ye.chmod(se.node,Y)},chown:(b,Y,se,fe)=>{var Pe;if(typeof b=="string"){var ze=ye.lookupPath(b,{follow:!fe});Pe=ze.node}else Pe=b;if(!Pe.node_ops.setattr)throw new ye.ErrnoError(63);Pe.node_ops.setattr(Pe,{timestamp:Date.now()})},lchown:(b,Y,se)=>{ye.chown(b,Y,se,!0)},fchown:(b,Y,se)=>{var fe=ye.getStreamChecked(b);ye.chown(fe.node,Y,se)},truncate:(b,Y)=>{if(Y<0)throw new ye.ErrnoError(28);var se;if(typeof b=="string"){var fe=ye.lookupPath(b,{follow:!0});se=fe.node}else se=b;if(!se.node_ops.setattr)throw new ye.ErrnoError(63);if(ye.isDir(se.mode))throw new ye.ErrnoError(31);if(!ye.isFile(se.mode))throw new ye.ErrnoError(28);var Pe=ye.nodePermissions(se,"w");if(Pe)throw new ye.ErrnoError(Pe);se.node_ops.setattr(se,{size:Y,timestamp:Date.now()})},ftruncate:(b,Y)=>{var se=ye.getStreamChecked(b);if(!(se.flags&2097155))throw new ye.ErrnoError(28);ye.truncate(se.node,Y)},utime:(b,Y,se)=>{var fe=ye.lookupPath(b,{follow:!0}),Pe=fe.node;Pe.node_ops.setattr(Pe,{timestamp:Math.max(Y,se)})},open:(b,Y,se)=>{if(b==="")throw new ye.ErrnoError(44);Y=typeof Y=="string"?It(Y):Y,se=typeof se>"u"?438:se,Y&64?se=se&4095|32768:se=0;var fe;if(typeof b=="object")fe=b;else{b=pn.normalize(b);try{var Pe=ye.lookupPath(b,{follow:!(Y&131072)});fe=Pe.node}catch{}}var ze=!1;if(Y&64)if(fe){if(Y&128)throw new ye.ErrnoError(20)}else fe=ye.mknod(b,se,0),ze=!0;if(!fe)throw new ye.ErrnoError(44);if(ye.isChrdev(fe.mode)&&(Y&=-513),Y&65536&&!ye.isDir(fe.mode))throw new ye.ErrnoError(54);if(!ze){var Ke=ye.mayOpen(fe,Y);if(Ke)throw new ye.ErrnoError(Ke)}Y&512&&!ze&&ye.truncate(fe,0),Y&=-131713;var $e=ye.createStream({node:fe,path:ye.getPath(fe),flags:Y,seekable:!0,position:0,stream_ops:fe.stream_ops,ungotten:[],error:!1});return $e.stream_ops.open&&$e.stream_ops.open($e),te.logReadFiles&&!(Y&1)&&(ye.readFiles||(ye.readFiles={}),b in ye.readFiles||(ye.readFiles[b]=1)),$e},close:b=>{if(ye.isClosed(b))throw new ye.ErrnoError(8);b.getdents&&(b.getdents=null);try{b.stream_ops.close&&b.stream_ops.close(b)}catch(Y){throw Y}finally{ye.closeStream(b.fd)}b.fd=null},isClosed:b=>b.fd===null,llseek:(b,Y,se)=>{if(ye.isClosed(b))throw new ye.ErrnoError(8);if(!b.seekable||!b.stream_ops.llseek)throw new ye.ErrnoError(70);if(se!=0&&se!=1&&se!=2)throw new ye.ErrnoError(28);return b.position=b.stream_ops.llseek(b,Y,se),b.ungotten=[],b.position},read:(b,Y,se,fe,Pe)=>{if(fe<0||Pe<0)throw new ye.ErrnoError(28);if(ye.isClosed(b))throw new ye.ErrnoError(8);if((b.flags&2097155)===1)throw new ye.ErrnoError(8);if(ye.isDir(b.node.mode))throw new ye.ErrnoError(31);if(!b.stream_ops.read)throw new ye.ErrnoError(28);var ze=typeof Pe<"u";if(!ze)Pe=b.position;else if(!b.seekable)throw new ye.ErrnoError(70);var Ke=b.stream_ops.read(b,Y,se,fe,Pe);return ze||(b.position+=Ke),Ke},write:(b,Y,se,fe,Pe,ze)=>{if(fe<0||Pe<0)throw new ye.ErrnoError(28);if(ye.isClosed(b))throw new ye.ErrnoError(8);if(!(b.flags&2097155))throw new ye.ErrnoError(8);if(ye.isDir(b.node.mode))throw new ye.ErrnoError(31);if(!b.stream_ops.write)throw new ye.ErrnoError(28);b.seekable&&b.flags&1024&&ye.llseek(b,0,2);var Ke=typeof Pe<"u";if(!Ke)Pe=b.position;else if(!b.seekable)throw new ye.ErrnoError(70);var $e=b.stream_ops.write(b,Y,se,fe,Pe,ze);return Ke||(b.position+=$e),$e},allocate:(b,Y,se)=>{if(ye.isClosed(b))throw new ye.ErrnoError(8);if(Y<0||se<=0)throw new ye.ErrnoError(28);if(!(b.flags&2097155))throw new ye.ErrnoError(8);if(!ye.isFile(b.node.mode)&&!ye.isDir(b.node.mode))throw new ye.ErrnoError(43);if(!b.stream_ops.allocate)throw new ye.ErrnoError(138);b.stream_ops.allocate(b,Y,se)},mmap:(b,Y,se,fe,Pe)=>{if(fe&2&&!(Pe&2)&&(b.flags&2097155)!==2)throw new ye.ErrnoError(2);if((b.flags&2097155)===1)throw new ye.ErrnoError(2);if(!b.stream_ops.mmap)throw new ye.ErrnoError(43);return b.stream_ops.mmap(b,Y,se,fe,Pe)},msync:(b,Y,se,fe,Pe)=>b.stream_ops.msync?b.stream_ops.msync(b,Y,se,fe,Pe):0,munmap:b=>0,ioctl:(b,Y,se)=>{if(!b.stream_ops.ioctl)throw new ye.ErrnoError(59);return b.stream_ops.ioctl(b,Y,se)},readFile:(b,Y={})=>{if(Y.flags=Y.flags||0,Y.encoding=Y.encoding||"binary",Y.encoding!=="utf8"&&Y.encoding!=="binary")throw new Error(`Invalid encoding type "${Y.encoding}"`);var se,fe=ye.open(b,Y.flags),Pe=ye.stat(b),ze=Pe.size,Ke=new Uint8Array(ze);return ye.read(fe,Ke,0,ze,0),Y.encoding==="utf8"?se=Es(Ke,0):Y.encoding==="binary"&&(se=Ke),ye.close(fe),se},writeFile:(b,Y,se={})=>{se.flags=se.flags||577;var fe=ye.open(b,se.flags,se.mode);if(typeof Y=="string"){var Pe=new Uint8Array(yd(Y)+1),ze=O3(Y,Pe,0,Pe.length);ye.write(fe,Pe,0,ze,void 0,se.canOwn)}else if(ArrayBuffer.isView(Y))ye.write(fe,Y,0,Y.byteLength,void 0,se.canOwn);else throw new Error("Unsupported data type");ye.close(fe)},cwd:()=>ye.currentPath,chdir:b=>{var Y=ye.lookupPath(b,{follow:!0});if(Y.node===null)throw new ye.ErrnoError(44);if(!ye.isDir(Y.node.mode))throw new ye.ErrnoError(54);var se=ye.nodePermissions(Y.node,"x");if(se)throw new ye.ErrnoError(se);ye.currentPath=Y.path},createDefaultDirectories:()=>{ye.mkdir("/tmp"),ye.mkdir("/home"),ye.mkdir("/home/web_user")},createDefaultDevices:()=>{ye.mkdir("/dev"),ye.registerDevice(ye.makedev(1,3),{read:()=>0,write:(fe,Pe,ze,Ke,$e)=>Ke}),ye.mkdev("/dev/null",ye.makedev(1,3)),ai.register(ye.makedev(5,0),ai.default_tty_ops),ai.register(ye.makedev(6,0),ai.default_tty1_ops),ye.mkdev("/dev/tty",ye.makedev(5,0)),ye.mkdev("/dev/tty1",ye.makedev(6,0));var b=new Uint8Array(1024),Y=0,se=()=>(Y===0&&(Y=Ms(b).byteLength),b[--Y]);ye.createDevice("/dev","random",se),ye.createDevice("/dev","urandom",se),ye.mkdir("/dev/shm"),ye.mkdir("/dev/shm/tmp")},createSpecialDirectories:()=>{ye.mkdir("/proc");var b=ye.mkdir("/proc/self");ye.mkdir("/proc/self/fd"),ye.mount({mount:()=>{var Y=ye.createNode(b,"fd",16895,73);return Y.node_ops={lookup:(se,fe)=>{var Pe=+fe,ze=ye.getStreamChecked(Pe),Ke={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>ze.path}};return Ke.parent=Ke,Ke}},Y}},{},"/proc/self/fd")},createStandardStreams:()=>{te.stdin?ye.createDevice("/dev","stdin",te.stdin):ye.symlink("/dev/tty","/dev/stdin"),te.stdout?ye.createDevice("/dev","stdout",null,te.stdout):ye.symlink("/dev/tty","/dev/stdout"),te.stderr?ye.createDevice("/dev","stderr",null,te.stderr):ye.symlink("/dev/tty1","/dev/stderr"),ye.open("/dev/stdin",0),ye.open("/dev/stdout",1),ye.open("/dev/stderr",1)},ensureErrnoError:()=>{ye.ErrnoError||(ye.ErrnoError=function(Y,se){this.name="ErrnoError",this.node=se,this.setErrno=function(fe){this.errno=fe},this.setErrno(Y),this.message="FS error"},ye.ErrnoError.prototype=new Error,ye.ErrnoError.prototype.constructor=ye.ErrnoError,[44].forEach(b=>{ye.genericErrors[b]=new ye.ErrnoError(b),ye.genericErrors[b].stack="<generic error, no stack>"}))},staticInit:()=>{ye.ensureErrnoError(),ye.nameTable=new Array(4096),ye.mount(Wn,{},"/"),ye.createDefaultDirectories(),ye.createDefaultDevices(),ye.createSpecialDirectories(),ye.filesystems={MEMFS:Wn}},init:(b,Y,se)=>{ye.init.initialized=!0,ye.ensureErrnoError(),te.stdin=b||te.stdin,te.stdout=Y||te.stdout,te.stderr=se||te.stderr,ye.createStandardStreams()},quit:()=>{ye.init.initialized=!1;for(var b=0;b<ye.streams.length;b++){var Y=ye.streams[b];Y&&ye.close(Y)}},findObject:(b,Y)=>{var se=ye.analyzePath(b,Y);return se.exists?se.object:null},analyzePath:(b,Y)=>{try{var se=ye.lookupPath(b,{follow:!Y});b=se.path}catch{}var fe={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var se=ye.lookupPath(b,{parent:!0});fe.parentExists=!0,fe.parentPath=se.path,fe.parentObject=se.node,fe.name=pn.basename(b),se=ye.lookupPath(b,{follow:!Y}),fe.exists=!0,fe.path=se.path,fe.object=se.node,fe.name=se.node.name,fe.isRoot=se.path==="/"}catch(Pe){fe.error=Pe.errno}return fe},createPath:(b,Y,se,fe)=>{b=typeof b=="string"?b:ye.getPath(b);for(var Pe=Y.split("/").reverse();Pe.length;){var ze=Pe.pop();if(ze){var Ke=pn.join2(b,ze);try{ye.mkdir(Ke)}catch{}b=Ke}}return Ke},createFile:(b,Y,se,fe,Pe)=>{var ze=pn.join2(typeof b=="string"?b:ye.getPath(b),Y),Ke=At(fe,Pe);return ye.create(ze,Ke)},createDataFile:(b,Y,se,fe,Pe,ze)=>{var Ke=Y;b&&(b=typeof b=="string"?b:ye.getPath(b),Ke=Y?pn.join2(b,Y):b);var $e=At(fe,Pe),it=ye.create(Ke,$e);if(se){if(typeof se=="string"){for(var mt=new Array(se.length),Yt=0,cn=se.length;Yt<cn;++Yt)mt[Yt]=se.charCodeAt(Yt);se=mt}ye.chmod(it,$e|146);var Zt=ye.open(it,577);ye.write(Zt,se,0,se.length,0,ze),ye.close(Zt),ye.chmod(it,$e)}return it},createDevice:(b,Y,se,fe)=>{var Pe=pn.join2(typeof b=="string"?b:ye.getPath(b),Y),ze=At(!!se,!!fe);ye.createDevice.major||(ye.createDevice.major=64);var Ke=ye.makedev(ye.createDevice.major++,0);return ye.registerDevice(Ke,{open:$e=>{$e.seekable=!1},close:$e=>{fe&&fe.buffer&&fe.buffer.length&&fe(10)},read:($e,it,mt,Yt,cn)=>{for(var Zt=0,sn=0;sn<Yt;sn++){var Cn;try{Cn=se()}catch{throw new ye.ErrnoError(29)}if(Cn===void 0&&Zt===0)throw new ye.ErrnoError(6);if(Cn==null)break;Zt++,it[mt+sn]=Cn}return Zt&&($e.node.timestamp=Date.now()),Zt},write:($e,it,mt,Yt,cn)=>{for(var Zt=0;Zt<Yt;Zt++)try{fe(it[mt+Zt])}catch{throw new ye.ErrnoError(29)}return Yt&&($e.node.timestamp=Date.now()),Zt}}),ye.mkdev(Pe,ze,Ke)},forceLoadFile:b=>{if(b.isDevice||b.isFolder||b.link||b.contents)return!0;if(typeof XMLHttpRequest<"u")throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");if(ge)try{b.contents=uc(ge(b.url),!0),b.usedBytes=b.contents.length}catch{throw new ye.ErrnoError(29)}else throw new Error("Cannot load without read() or XMLHttpRequest.")},createLazyFile:(b,Y,se,fe,Pe)=>{function ze(){this.lengthKnown=!1,this.chunks=[]}if(ze.prototype.get=function(sn){if(!(sn>this.length-1||sn<0)){var Cn=sn%this.chunkSize,pl=sn/this.chunkSize|0;return this.getter(pl)[Cn]}},ze.prototype.setDataGetter=function(sn){this.getter=sn},ze.prototype.cacheLength=function(){var sn=new XMLHttpRequest;if(sn.open("HEAD",se,!1),sn.send(null),!(sn.status>=200&&sn.status<300||sn.status===304))throw new Error("Couldn't load "+se+". Status: "+sn.status);var Cn=Number(sn.getResponseHeader("Content-length")),pl,ml=(pl=sn.getResponseHeader("Accept-Ranges"))&&pl==="bytes",Gl=(pl=sn.getResponseHeader("Content-Encoding"))&&pl==="gzip",xt=1024*1024;ml||(xt=Cn);var rn=(Ml,ea)=>{if(Ml>ea)throw new Error("invalid range ("+Ml+", "+ea+") or no bytes requested!");if(ea>Cn-1)throw new Error("only "+Cn+" bytes available! programmer error!");var ls=new XMLHttpRequest;if(ls.open("GET",se,!1),Cn!==xt&&ls.setRequestHeader("Range","bytes="+Ml+"-"+ea),ls.responseType="arraybuffer",ls.overrideMimeType&&ls.overrideMimeType("text/plain; charset=x-user-defined"),ls.send(null),!(ls.status>=200&&ls.status<300||ls.status===304))throw new Error("Couldn't load "+se+". Status: "+ls.status);return ls.response!==void 0?new Uint8Array(ls.response||[]):uc(ls.responseText||"",!0)},Ws=this;Ws.setDataGetter(Ml=>{var ea=Ml*xt,ls=(Ml+1)*xt-1;if(ls=Math.min(ls,Cn-1),typeof Ws.chunks[Ml]>"u"&&(Ws.chunks[Ml]=rn(ea,ls)),typeof Ws.chunks[Ml]>"u")throw new Error("doXHR failed!");return Ws.chunks[Ml]}),(Gl||!Cn)&&(xt=Cn=1,Cn=this.getter(0).length,xt=Cn,lt("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=Cn,this._chunkSize=xt,this.lengthKnown=!0},typeof XMLHttpRequest<"u"){if(!Ne)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var Ke=new ze;Object.defineProperties(Ke,{length:{get:function(){return this.lengthKnown||this.cacheLength(),this._length}},chunkSize:{get:function(){return this.lengthKnown||this.cacheLength(),this._chunkSize}}});var $e={isDevice:!1,contents:Ke}}else var $e={isDevice:!1,url:se};var it=ye.createFile(b,Y,$e,fe,Pe);$e.contents?it.contents=$e.contents:$e.url&&(it.contents=null,it.url=$e.url),Object.defineProperties(it,{usedBytes:{get:function(){return this.contents.length}}});var mt={},Yt=Object.keys(it.stream_ops);Yt.forEach(Zt=>{var sn=it.stream_ops[Zt];mt[Zt]=function(){return ye.forceLoadFile(it),sn.apply(null,arguments)}});function cn(Zt,sn,Cn,pl,ml){var Gl=Zt.node.contents;if(ml>=Gl.length)return 0;var xt=Math.min(Gl.length-ml,pl);if(Gl.slice)for(var rn=0;rn<xt;rn++)sn[Cn+rn]=Gl[ml+rn];else for(var rn=0;rn<xt;rn++)sn[Cn+rn]=Gl.get(ml+rn);return xt}return mt.read=(Zt,sn,Cn,pl,ml)=>(ye.forceLoadFile(it),cn(Zt,sn,Cn,pl,ml)),mt.mmap=(Zt,sn,Cn,pl,ml)=>{ye.forceLoadFile(it);var Gl=O0();if(!Gl)throw new ye.ErrnoError(48);return cn(Zt,y(),Gl,sn,Cn),{ptr:Gl,allocated:!0}},it.stream_ops=mt,it}},pt=(b,Y)=>(b>>>=0,b?Es(A(),b,Y):""),an={DEFAULT_POLLMASK:5,calculateAt:function(b,Y,se){if(pn.isAbs(Y))return Y;var fe;if(b===-100)fe=ye.cwd();else{var Pe=an.getStreamFromFD(b);fe=Pe.path}if(Y.length==0){if(!se)throw new ye.ErrnoError(44);return fe}return pn.join2(fe,Y)},doStat:function(b,Y,se){try{var fe=b(Y)}catch($e){if($e&&$e.node&&pn.normalize(Y)!==pn.normalize(ye.getPath($e.node)))return-54;throw $e}_()[se>>>2]=fe.dev,_()[se+4>>>2]=fe.mode,Q()[se+8>>>2]=fe.nlink,_()[se+12>>>2]=fe.uid,_()[se+16>>>2]=fe.gid,_()[se+20>>>2]=fe.rdev,En=[fe.size>>>0,(hn=fe.size,+Math.abs(hn)>=1?hn>0?+Math.floor(hn/4294967296)>>>0:~~+Math.ceil((hn-+(~~hn>>>0))/4294967296)>>>0:0)],_()[se+24>>>2]=En[0],_()[se+28>>>2]=En[1],_()[se+32>>>2]=4096,_()[se+36>>>2]=fe.blocks;var Pe=fe.atime.getTime(),ze=fe.mtime.getTime(),Ke=fe.ctime.getTime();return En=[Math.floor(Pe/1e3)>>>0,(hn=Math.floor(Pe/1e3),+Math.abs(hn)>=1?hn>0?+Math.floor(hn/4294967296)>>>0:~~+Math.ceil((hn-+(~~hn>>>0))/4294967296)>>>0:0)],_()[se+40>>>2]=En[0],_()[se+44>>>2]=En[1],Q()[se+48>>>2]=Pe%1e3*1e3,En=[Math.floor(ze/1e3)>>>0,(hn=Math.floor(ze/1e3),+Math.abs(hn)>=1?hn>0?+Math.floor(hn/4294967296)>>>0:~~+Math.ceil((hn-+(~~hn>>>0))/4294967296)>>>0:0)],_()[se+56>>>2]=En[0],_()[se+60>>>2]=En[1],Q()[se+64>>>2]=ze%1e3*1e3,En=[Math.floor(Ke/1e3)>>>0,(hn=Math.floor(Ke/1e3),+Math.abs(hn)>=1?hn>0?+Math.floor(hn/4294967296)>>>0:~~+Math.ceil((hn-+(~~hn>>>0))/4294967296)>>>0:0)],_()[se+72>>>2]=En[0],_()[se+76>>>2]=En[1],Q()[se+80>>>2]=Ke%1e3*1e3,En=[fe.ino>>>0,(hn=fe.ino,+Math.abs(hn)>=1?hn>0?+Math.floor(hn/4294967296)>>>0:~~+Math.ceil((hn-+(~~hn>>>0))/4294967296)>>>0:0)],_()[se+88>>>2]=En[0],_()[se+92>>>2]=En[1],0},doMsync:function(b,Y,se,fe,Pe){if(!ye.isFile(Y.node.mode))throw new ye.ErrnoError(43);if(fe&2)return 0;var ze=A().slice(b,b+se);ye.msync(Y,ze,Pe,se,fe)},varargs:void 0,get(){an.varargs+=4;var b=_()[an.varargs-4>>>2];return b},getStr(b){var Y=pt(b);return Y},getStreamFromFD:function(b){var Y=ye.getStreamChecked(b);return Y}};function Nn(b){if(Be)return kt(1,1,b);Ft=b,Bl()||($t.terminateAllThreads(),te.onExit&&te.onExit(b),Ct=!0),Re(b,new Jt(b))}var Gn=(b,Y)=>{if(Ft=b,Be)throw Iu(b),"unwind";Nn(b)},jn=Gn,tl=b=>{if(b instanceof Jt||b=="unwind")return Ft;Re(1,b)},$t={unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},init:function(){Be?$t.initWorker():$t.initMainThread()},initMainThread:function(){for(var b=navigator.hardwareConcurrency;b--;)$t.allocateUnusedWorker();Dt(()=>{In(),$t.loadWasmModuleToAllWorkers(()=>bn())})},initWorker:function(){at=!1},setExitStatus:function(b){Ft=b},terminateAllThreads__deps:["$terminateWorker"],terminateAllThreads:function(){for(var b of $t.runningWorkers)ut(b);for(var b of $t.unusedWorkers)ut(b);$t.unusedWorkers=[],$t.runningWorkers=[],$t.pthreads=[]},returnWorkerToPool:function(b){var Y=b.pthread_ptr;delete $t.pthreads[Y],$t.unusedWorkers.push(b),$t.runningWorkers.splice($t.runningWorkers.indexOf(b),1),b.pthread_ptr=0,b0(Y)},receiveObjectTransfer:function(b){},threadInitTLS:function(){$t.tlsInitFunctions.forEach(b=>b())},loadWasmModuleToWorker:b=>new Promise(Y=>{b.onmessage=ze=>{var Ke=ze.data,$e=Ke.cmd;if(Ke.targetThread&&Ke.targetThread!=M3()){var it=$t.pthreads[Ke.targetThread];it?it.postMessage(Ke,Ke.transferList):ht('Internal error! Worker sent a message "'+$e+'" to target pthread '+Ke.targetThread+", but that thread no longer exists!");return}$e==="checkMailbox"?yc():$e==="spawnThread"?Bn(Ke):$e==="cleanupThread"?nn(Ke.thread):$e==="killThread"?Kt(Ke.thread):$e==="cancelThread"?tn(Ke.thread):$e==="loaded"?(b.loaded=!0,Y(b)):$e==="alert"?alert("Thread "+Ke.threadId+": "+Ke.text):Ke.target==="setimmediate"?b.postMessage(Ke):$e==="callHandler"?te[Ke.handler](...Ke.args):$e&&ht("worker sent an unknown command "+$e)},b.onerror=ze=>{var Ke="worker sent an error!";throw ht(Ke+" "+ze.filename+":"+ze.lineno+": "+ze.message),ze};var se=[],fe=["onExit","onAbort","print","printErr"];for(var Pe of fe)te.hasOwnProperty(Pe)&&se.push(Pe);b.postMessage({cmd:"load",handlers:se,urlOrBlob:te.mainScriptUrlOrBlob||t,wasmMemory:ft,wasmModule:bt})}),loadWasmModuleToAllWorkers:function(b){if(Be)return b();Promise.all($t.unusedWorkers.map($t.loadWasmModuleToWorker)).then(b)},allocateUnusedWorker:function(){var b,Y=Je("web-ifc-mt.worker.js");b=new Worker(Y),$t.unusedWorkers.push(b)},getNewWorker:function(){return $t.unusedWorkers.length==0&&($t.allocateUnusedWorker(),$t.loadWasmModuleToWorker($t.unusedWorkers[0])),$t.unusedWorkers.pop()}};te.PThread=$t;var Jn=b=>{for(;b.length>0;)b.shift()(te)};function Ul(){var b=M3(),Y=_()[b+52>>>2],se=_()[b+56>>>2],fe=Y-se;c5(Y,fe),M0(Y)}te.establishStackSpace=Ul;function Iu(b){if(Be)return kt(2,0,b);jn(b)}var Ls=[],Lu=b=>{var Y=Ls[b];return Y||(b>=Ls.length&&(Ls.length=b+1),Ls[b]=Y=Tt.get(b)),Y};function vl(b,Y){var se=Lu(b)(Y);function fe(Pe){Bl()?$t.setExitStatus(Pe):C0(Pe)}fe(se)}te.invokeEntryPoint=vl;function rl(b){$t.tlsInitFunctions.push(b)}function g3(b){this.excPtr=b,this.ptr=b-24,this.set_type=function(Y){Q()[this.ptr+4>>>2]=Y},this.get_type=function(){return Q()[this.ptr+4>>>2]},this.set_destructor=function(Y){Q()[this.ptr+8>>>2]=Y},this.get_destructor=function(){return Q()[this.ptr+8>>>2]},this.set_caught=function(Y){Y=Y?1:0,y()[this.ptr+12>>>0]=Y},this.get_caught=function(){return y()[this.ptr+12>>>0]!=0},this.set_rethrown=function(Y){Y=Y?1:0,y()[this.ptr+13>>>0]=Y},this.get_rethrown=function(){return y()[this.ptr+13>>>0]!=0},this.init=function(Y,se){this.set_adjusted_ptr(0),this.set_type(Y),this.set_destructor(se)},this.set_adjusted_ptr=function(Y){Q()[this.ptr+16>>>2]=Y},this.get_adjusted_ptr=function(){return Q()[this.ptr+16>>>2]},this.get_exception_ptr=function(){var Y=I5(this.get_type());if(Y)return Q()[this.excPtr>>>2];var se=this.get_adjusted_ptr();return se!==0?se:this.excPtr}}var es=0;function Ou(b,Y){return Y+2097152>>>0<4194305-!!b?(b>>>0)+Y*4294967296:NaN}function P3(b,Y,se){b>>>=0,Y>>>=0,se>>>=0;var fe=new g3(b);throw fe.init(Y,se),es=b,es}function Vc(b){b>>>=0,a5(b,!Ne,1,!Ie,5242880,!1),$t.threadInitTLS()}function Ed(b){b>>>=0,Be?postMessage({cmd:"cleanupThread",thread:b}):nn(b)}var Os={};function Zu(b){for(;b.length;){var Y=b.pop(),se=b.pop();se(Y)}}function ii(b){return this.fromWireType(_()[b>>>2])}var xs={},Hs={},Wc={},Td=void 0;function jc(b){throw new Td(b)}function gu(b,Y,se){b.forEach(function($e){Wc[$e]=Y});function fe($e){var it=se($e);it.length!==b.length&&jc("Mismatched type converter count");for(var mt=0;mt<b.length;++mt)Pu(b[mt],it[mt])}var Pe=new Array(Y.length),ze=[],Ke=0;Y.forEach(($e,it)=>{Hs.hasOwnProperty($e)?Pe[it]=Hs[$e]:(ze.push($e),xs.hasOwnProperty($e)||(xs[$e]=[]),xs[$e].push(()=>{Pe[it]=Hs[$e],++Ke,Ke===ze.length&&fe(Pe)}))}),ze.length===0&&fe(Pe)}function pd(b){b>>>=0;var Y=Os[b];delete Os[b];var se=Y.elements,fe=se.length,Pe=se.map(function($e){return $e.getterReturnType}).concat(se.map(function($e){return $e.setterArgumentType})),ze=Y.rawConstructor,Ke=Y.rawDestructor;gu([b],Pe,function($e){return se.forEach((it,mt)=>{var Yt=$e[mt],cn=it.getter,Zt=it.getterContext,sn=$e[mt+fe],Cn=it.setter,pl=it.setterContext;it.read=ml=>Yt.fromWireType(cn(Zt,ml)),it.write=(ml,Gl)=>{var xt=[];Cn(pl,ml,sn.toWireType(xt,Gl)),Zu(xt)}}),[{name:Y.name,fromWireType:function(it){for(var mt=new Array(fe),Yt=0;Yt<fe;++Yt)mt[Yt]=se[Yt].read(it);return Ke(it),mt},toWireType:function(it,mt){if(fe!==mt.length)throw new TypeError(`Incorrect number of tuple elements for ${Y.name}: expected=${fe}, actual=${mt.length}`);for(var Yt=ze(),cn=0;cn<fe;++cn)se[cn].write(Yt,mt[cn]);return it!==null&&it.push(Ke,Yt),Yt},argPackAdvance:8,readValueFromPointer:ii,destructorFunction:Ke}]})}var ac={},Bs=function(b){b>>>=0;var Y=ac[b];delete ac[b];var se=Y.rawConstructor,fe=Y.rawDestructor,Pe=Y.fields,ze=Pe.map(Ke=>Ke.getterReturnType).concat(Pe.map(Ke=>Ke.setterArgumentType));gu([b],ze,Ke=>{var $e={};return Pe.forEach((it,mt)=>{var Yt=it.fieldName,cn=Ke[mt],Zt=it.getter,sn=it.getterContext,Cn=Ke[mt+Pe.length],pl=it.setter,ml=it.setterContext;$e[Yt]={read:Gl=>cn.fromWireType(Zt(sn,Gl)),write:(Gl,xt)=>{var rn=[];pl(ml,Gl,Cn.toWireType(rn,xt)),Zu(rn)}}}),[{name:Y.name,fromWireType:function(it){var mt={};for(var Yt in $e)mt[Yt]=$e[Yt].read(it);return fe(it),mt},toWireType:function(it,mt){for(var Yt in $e)if(!(Yt in mt))throw new TypeError(`Missing field: "${Yt}"`);var cn=se();for(Yt in $e)$e[Yt].write(cn,mt[Yt]);return it!==null&&it.push(fe,cn),cn},argPackAdvance:8,readValueFromPointer:ii,destructorFunction:fe}]})};function Rd(b,Y,se,fe,Pe){}function ic(b){switch(b){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError(`Unknown type size: ${b}`)}}function tI(){for(var b=new Array(256),Y=0;Y<256;++Y)b[Y]=String.fromCharCode(Y);Ci=b}var Ci=void 0;function gs(b){for(var Y="",se=b;A()[se>>>0];)Y+=Ci[A()[se++>>>0]];return Y}var Ju=void 0;function cl(b){throw new Ju(b)}function Yc(b,Y,se={}){var fe=Y.name;if(b||cl(`type "${fe}" must have a positive integer typeid pointer`),Hs.hasOwnProperty(b)){if(se.ignoreDuplicateRegistrations)return;cl(`Cannot register type '${fe}' twice`)}if(Hs[b]=Y,delete Wc[b],xs.hasOwnProperty(b)){var Pe=xs[b];delete xs[b],Pe.forEach(ze=>ze())}}function Pu(b,Y,se={}){if(!("argPackAdvance"in Y))throw new TypeError("registerType registeredInstance requires argPackAdvance");return Yc(b,Y,se)}function md(b,Y,se,fe,Pe){b>>>=0,Y>>>=0,se>>>=0;var ze=ic(se);Y=gs(Y),Pu(b,{name:Y,fromWireType:function(Ke){return!!Ke},toWireType:function(Ke,$e){return $e?fe:Pe},argPackAdvance:8,readValueFromPointer:function(Ke){var $e;if(se===1)$e=y();else if(se===2)$e=g();else if(se===4)$e=_();else throw new TypeError("Unknown boolean type size: "+Y);return this.fromWireType($e[Ke>>>ze])},destructorFunction:null})}function Dd(b){if(!(this instanceof Xu)||!(b instanceof Xu))return!1;for(var Y=this.$$.ptrType.registeredClass,se=this.$$.ptr,fe=b.$$.ptrType.registeredClass,Pe=b.$$.ptr;Y.baseClass;)se=Y.upcast(se),Y=Y.baseClass;for(;fe.baseClass;)Pe=fe.upcast(Pe),fe=fe.baseClass;return Y===fe&&se===Pe}function nI(b){return{count:b.count,deleteScheduled:b.deleteScheduled,preservePointerOnDelete:b.preservePointerOnDelete,ptr:b.ptr,ptrType:b.ptrType,smartPtr:b.smartPtr,smartPtrType:b.smartPtrType}}function Vs(b){function Y(se){return se.$$.ptrType.registeredClass.name}cl(Y(b)+" instance already deleted")}var Mi=!1;function lI(b){}function Nd(b){b.smartPtr?b.smartPtrType.rawDestructor(b.smartPtr):b.ptrType.registeredClass.rawDestructor(b.ptr)}function Cl(b){b.count.value-=1;var Y=b.count.value===0;Y&&Nd(b)}function sI(b,Y,se){if(Y===se)return b;if(se.baseClass===void 0)return null;var fe=sI(b,Y,se.baseClass);return fe===null?null:se.downcast(fe)}var oc={};function Ad(){return Object.keys(oi).length}function Sd(){var b=[];for(var Y in oi)oi.hasOwnProperty(Y)&&b.push(oi[Y]);return b}var xi=[];function zc(){for(;xi.length;){var b=xi.pop();b.$$.deleteScheduled=!1,b.delete()}}var Hi=void 0;function Ld(b){Hi=b,xi.length&&Hi&&Hi(zc)}function kc(){te.getInheritedInstanceCount=Ad,te.getLiveInheritedInstances=Sd,te.flushPendingDeletes=zc,te.setDelayFunction=Ld}var oi={};function cc(b,Y){for(Y===void 0&&cl("ptr should not be undefined");b.baseClass;)Y=b.upcast(Y),b=b.baseClass;return Y}function rI(b,Y){return Y=cc(b,Y),oi[Y]}function bu(b,Y){(!Y.ptrType||!Y.ptr)&&jc("makeClassHandle requires ptr and ptrType");var se=!!Y.smartPtrType,fe=!!Y.smartPtr;return se!==fe&&jc("Both smartPtrType and smartPtr must be specified"),Y.count={value:1},Bi(Object.create(b,{$$:{value:Y}}))}function hc(b){var Y=this.getPointee(b);if(!Y)return this.destructor(b),null;var se=rI(this.registeredClass,Y);if(se!==void 0){if(se.$$.count.value===0)return se.$$.ptr=Y,se.$$.smartPtr=b,se.clone();var fe=se.clone();return this.destructor(b),fe}function Pe(){return this.isSmartPointer?bu(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:Y,smartPtrType:this,smartPtr:b}):bu(this.registeredClass.instancePrototype,{ptrType:this,ptr:b})}var ze=this.registeredClass.getActualType(Y),Ke=oc[ze];if(!Ke)return Pe.call(this);var $e;this.isConst?$e=Ke.constPointerType:$e=Ke.pointerType;var it=sI(Y,this.registeredClass,$e.registeredClass);return it===null?Pe.call(this):this.isSmartPointer?bu($e.registeredClass.instancePrototype,{ptrType:$e,ptr:it,smartPtrType:this,smartPtr:b}):bu($e.registeredClass.instancePrototype,{ptrType:$e,ptr:it})}var Bi=function(b){return typeof FinalizationRegistry>"u"?(Bi=Y=>Y,b):(Mi=new FinalizationRegistry(Y=>{Cl(Y.$$)}),Bi=Y=>{var se=Y.$$,fe=!!se.smartPtr;if(fe){var Pe={$$:se};Mi.register(Y,Pe,Y)}return Y},lI=Y=>Mi.unregister(Y),Bi(b))};function uI(){if(this.$$.ptr||Vs(this),this.$$.preservePointerOnDelete)return this.$$.count.value+=1,this;var b=Bi(Object.create(Object.getPrototypeOf(this),{$$:{value:nI(this.$$)}}));return b.$$.count.value+=1,b.$$.deleteScheduled=!1,b}function Od(){this.$$.ptr||Vs(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&cl("Object already scheduled for deletion"),lI(this),Cl(this.$$),this.$$.preservePointerOnDelete||(this.$$.smartPtr=void 0,this.$$.ptr=void 0)}function gd(){return!this.$$.ptr}function Pd(){return this.$$.ptr||Vs(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&cl("Object already scheduled for deletion"),xi.push(this),xi.length===1&&Hi&&Hi(zc),this.$$.deleteScheduled=!0,this}function bd(){Xu.prototype.isAliasOf=Dd,Xu.prototype.clone=uI,Xu.prototype.delete=Od,Xu.prototype.isDeleted=gd,Xu.prototype.deleteLater=Pd}function Xu(){}var Cd=48,Md=57;function qc(b){if(b===void 0)return"_unknown";b=b.replace(/[^a-zA-Z0-9_]/g,"$");var Y=b.charCodeAt(0);return Y>=Cd&&Y<=Md?`_${b}`:b}function Kc(b,Y){return b=qc(b),{[b]:function(){return Y.apply(this,arguments)}}[b]}function aI(b,Y,se){if(b[Y].overloadTable===void 0){var fe=b[Y];b[Y]=function(){return b[Y].overloadTable.hasOwnProperty(arguments.length)||cl(`Function '${se}' called with an invalid number of arguments (${arguments.length}) - expects one of (${b[Y].overloadTable})!`),b[Y].overloadTable[arguments.length].apply(this,arguments)},b[Y].overloadTable=[],b[Y].overloadTable[fe.argCount]=fe}}function iI(b,Y,se){te.hasOwnProperty(b)?((se===void 0||te[b].overloadTable!==void 0&&te[b].overloadTable[se]!==void 0)&&cl(`Cannot register public name '${b}' twice`),aI(te,b,b),te.hasOwnProperty(se)&&cl(`Cannot register multiple overloads of a function with the same number of arguments (${se})!`),te[b].overloadTable[se]=Y):(te[b]=Y,se!==void 0&&(te[b].numArguments=se))}function xd(b,Y,se,fe,Pe,ze,Ke,$e){this.name=b,this.constructor=Y,this.instancePrototype=se,this.rawDestructor=fe,this.baseClass=Pe,this.getActualType=ze,this.upcast=Ke,this.downcast=$e,this.pureVirtualFunctions=[]}function Qc(b,Y,se){for(;Y!==se;)Y.upcast||cl(`Expected null or instance of ${se.name}, got an instance of ${Y.name}`),b=Y.upcast(b),Y=Y.baseClass;return b}function Hd(b,Y){if(Y===null)return this.isReference&&cl(`null is not a valid ${this.name}`),0;Y.$$||cl(`Cannot pass "${Xc(Y)}" as a ${this.name}`),Y.$$.ptr||cl(`Cannot pass deleted object as a pointer of type ${this.name}`);var se=Y.$$.ptrType.registeredClass,fe=Qc(Y.$$.ptr,se,this.registeredClass);return fe}function $c(b,Y){var se;if(Y===null)return this.isReference&&cl(`null is not a valid ${this.name}`),this.isSmartPointer?(se=this.rawConstructor(),b!==null&&b.push(this.rawDestructor,se),se):0;Y.$$||cl(`Cannot pass "${Xc(Y)}" as a ${this.name}`),Y.$$.ptr||cl(`Cannot pass deleted object as a pointer of type ${this.name}`),!this.isConst&&Y.$$.ptrType.isConst&&cl(`Cannot convert argument of type ${Y.$$.smartPtrType?Y.$$.smartPtrType.name:Y.$$.ptrType.name} to parameter type ${this.name}`);var fe=Y.$$.ptrType.registeredClass;if(se=Qc(Y.$$.ptr,fe,this.registeredClass),this.isSmartPointer)switch(Y.$$.smartPtr===void 0&&cl("Passing raw pointer to smart pointer is illegal"),this.sharingPolicy){case 0:Y.$$.smartPtrType===this?se=Y.$$.smartPtr:cl(`Cannot convert argument of type ${Y.$$.smartPtrType?Y.$$.smartPtrType.name:Y.$$.ptrType.name} to parameter type ${this.name}`);break;case 1:se=Y.$$.smartPtr;break;case 2:if(Y.$$.smartPtrType===this)se=Y.$$.smartPtr;else{var Pe=Y.clone();se=this.rawShare(se,Fl.toHandle(function(){Pe.delete()})),b!==null&&b.push(this.rawDestructor,se)}break;default:cl("Unsupporting sharing policy")}return se}function Bd(b,Y){if(Y===null)return this.isReference&&cl(`null is not a valid ${this.name}`),0;Y.$$||cl(`Cannot pass "${Xc(Y)}" as a ${this.name}`),Y.$$.ptr||cl(`Cannot pass deleted object as a pointer of type ${this.name}`),Y.$$.ptrType.isConst&&cl(`Cannot convert argument of type ${Y.$$.ptrType.name} to parameter type ${this.name}`);var se=Y.$$.ptrType.registeredClass,fe=Qc(Y.$$.ptr,se,this.registeredClass);return fe}function Ud(b){return this.rawGetPointee&&(b=this.rawGetPointee(b)),b}function Fd(b){this.rawDestructor&&this.rawDestructor(b)}function Gd(b){b!==null&&b.delete()}function oI(){du.prototype.getPointee=Ud,du.prototype.destructor=Fd,du.prototype.argPackAdvance=8,du.prototype.readValueFromPointer=ii,du.prototype.deleteObject=Gd,du.prototype.fromWireType=hc}function du(b,Y,se,fe,Pe,ze,Ke,$e,it,mt,Yt){this.name=b,this.registeredClass=Y,this.isReference=se,this.isConst=fe,this.isSmartPointer=Pe,this.pointeeType=ze,this.sharingPolicy=Ke,this.rawGetPointee=$e,this.rawConstructor=it,this.rawShare=mt,this.rawDestructor=Yt,!Pe&&Y.baseClass===void 0?fe?(this.toWireType=Hd,this.destructorFunction=null):(this.toWireType=Bd,this.destructorFunction=null):this.toWireType=$c}function cI(b,Y,se){te.hasOwnProperty(b)||jc("Replacing nonexistant public symbol"),te[b].overloadTable!==void 0&&se!==void 0?te[b].overloadTable[se]=Y:(te[b]=Y,te[b].argCount=se)}var _d=(b,Y,se)=>{var fe=te["dynCall_"+b];return se&&se.length?fe.apply(null,[Y].concat(se)):fe.call(null,Y)},Vd=(b,Y,se)=>{if(b.includes("j"))return _d(b,Y,se);var fe=Lu(Y).apply(null,se);return fe},Wd=(b,Y)=>{var se=[];return function(){return se.length=0,Object.assign(se,arguments),Vd(b,Y,se)}};function Us(b,Y){b=gs(b);function se(){return b.includes("j")?Wd(b,Y):Lu(Y)}var fe=se();return typeof fe!="function"&&cl(`unknown function pointer with signature ${b}: ${Y}`),fe}function jd(b,Y){var se=Kc(Y,function(fe){this.name=Y,this.message=fe;var Pe=new Error(fe).stack;Pe!==void 0&&(this.stack=this.toString()+`
`+Pe.replace(/^Error(:[^\n]*)?\n/,""))});return se.prototype=Object.create(b.prototype),se.prototype.constructor=se,se.prototype.toString=function(){return this.message===void 0?this.name:`${this.name}: ${this.message}`},se}var hI=void 0;function fI(b){var Y=u5(b),se=gs(Y);return Gi(Y),se}function fc(b,Y){var se=[],fe={};function Pe(ze){if(!fe[ze]&&!Hs[ze]){if(Wc[ze]){Wc[ze].forEach(Pe);return}se.push(ze),fe[ze]=!0}}throw Y.forEach(Pe),new hI(`${b}: `+se.map(fI).join([", "]))}function Yd(b,Y,se,fe,Pe,ze,Ke,$e,it,mt,Yt,cn,Zt){b>>>=0,Y>>>=0,se>>>=0,fe>>>=0,Pe>>>=0,ze>>>=0,Ke>>>=0,$e>>>=0,it>>>=0,mt>>>=0,Yt>>>=0,cn>>>=0,Zt>>>=0,Yt=gs(Yt),ze=Us(Pe,ze),$e&&($e=Us(Ke,$e)),mt&&(mt=Us(it,mt)),Zt=Us(cn,Zt);var sn=qc(Yt);iI(sn,function(){fc(`Cannot construct ${Yt} due to unbound types`,[fe])}),gu([b,Y,se],fe?[fe]:[],function(Cn){Cn=Cn[0];var pl,ml;fe?(pl=Cn.registeredClass,ml=pl.instancePrototype):ml=Xu.prototype;var Gl=Kc(sn,function(){if(Object.getPrototypeOf(this)!==xt)throw new Ju("Use 'new' to construct "+Yt);if(rn.constructor_body===void 0)throw new Ju(Yt+" has no accessible constructor");var ls=rn.constructor_body[arguments.length];if(ls===void 0)throw new Ju(`Tried to invoke ctor of ${Yt} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(rn.constructor_body).toString()}) parameters instead!`);return ls.apply(this,arguments)}),xt=Object.create(ml,{constructor:{value:Gl}});Gl.prototype=xt;var rn=new xd(Yt,Gl,xt,Zt,pl,ze,$e,mt);rn.baseClass&&(rn.baseClass.__derivedClasses===void 0&&(rn.baseClass.__derivedClasses=[]),rn.baseClass.__derivedClasses.push(rn));var Ws=new du(Yt,rn,!0,!1,!1),Ml=new du(Yt+"*",rn,!1,!1,!1),ea=new du(Yt+" const*",rn,!1,!0,!1);return oc[b]={pointerType:Ml,constPointerType:ea},cI(sn,Gl),[Ws,Ml,ea]})}function Zc(b,Y){for(var se=[],fe=0;fe<b;fe++)se.push(Q()[Y+fe*4>>>2]);return se}function zd(b,Y){if(!(b instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof b} which is not a function`);var se=Kc(b.name||"unknownFunctionName",function(){});se.prototype=b.prototype;var fe=new se,Pe=b.apply(fe,Y);return Pe instanceof Object?Pe:fe}function Jc(b,Y,se,fe,Pe,ze){var Ke=Y.length;Ke<2&&cl("argTypes array size mismatch! Must at least get return value and 'this' types!");for(var $e=Y[1]!==null&&se!==null,it=!1,mt=1;mt<Y.length;++mt)if(Y[mt]!==null&&Y[mt].destructorFunction===void 0){it=!0;break}for(var Yt=Y[0].name!=="void",cn="",Zt="",mt=0;mt<Ke-2;++mt)cn+=(mt!==0?", ":"")+"arg"+mt,Zt+=(mt!==0?", ":"")+"arg"+mt+"Wired";var sn=`
        return function ${qc(b)}(${cn}) {
        if (arguments.length !== ${Ke-2}) {
          throwBindingError('function ${b} called with ${arguments.length} arguments, expected ${Ke-2} args!');
        }`;it&&(sn+=`var destructors = [];
`);var Cn=it?"destructors":"null",pl=["throwBindingError","invoker","fn","runDestructors","retType","classParam"],ml=[cl,fe,Pe,Zu,Y[0],Y[1]];$e&&(sn+="var thisWired = classParam.toWireType("+Cn+`, this);
`);for(var mt=0;mt<Ke-2;++mt)sn+="var arg"+mt+"Wired = argType"+mt+".toWireType("+Cn+", arg"+mt+"); // "+Y[mt+2].name+`
`,pl.push("argType"+mt),ml.push(Y[mt+2]);if($e&&(Zt="thisWired"+(Zt.length>0?", ":"")+Zt),sn+=(Yt||ze?"var rv = ":"")+"invoker(fn"+(Zt.length>0?", ":"")+Zt+`);
`,it)sn+=`runDestructors(destructors);
`;else for(var mt=$e?1:2;mt<Y.length;++mt){var Gl=mt===1?"thisWired":"arg"+(mt-2)+"Wired";Y[mt].destructorFunction!==null&&(sn+=Gl+"_dtor("+Gl+"); // "+Y[mt].name+`
`,pl.push(Gl+"_dtor"),ml.push(Y[mt].destructorFunction))}return Yt&&(sn+=`var ret = retType.fromWireType(rv);
return ret;
`),sn+=`}
`,pl.push(sn),zd(Function,pl).apply(null,ml)}function Ui(b,Y,se,fe,Pe,ze){b>>>=0,se>>>=0,fe>>>=0,Pe>>>=0,ze>>>=0;var Ke=Zc(Y,se);Pe=Us(fe,Pe),gu([],[b],function($e){$e=$e[0];var it=`constructor ${$e.name}`;if($e.registeredClass.constructor_body===void 0&&($e.registeredClass.constructor_body=[]),$e.registeredClass.constructor_body[Y-1]!==void 0)throw new Ju(`Cannot register multiple constructors with identical number of parameters (${Y-1}) for class '${$e.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);return $e.registeredClass.constructor_body[Y-1]=()=>{fc(`Cannot construct ${$e.name} due to unbound types`,Ke)},gu([],Ke,function(mt){return mt.splice(1,0,null),$e.registeredClass.constructor_body[Y-1]=Jc(it,mt,null,Pe,ze),[]}),[]})}function kd(b,Y,se,fe,Pe,ze,Ke,$e,it){b>>>=0,Y>>>=0,fe>>>=0,Pe>>>=0,ze>>>=0,Ke>>>=0;var mt=Zc(se,fe);Y=gs(Y),ze=Us(Pe,ze),gu([],[b],function(Yt){Yt=Yt[0];var cn=`${Yt.name}.${Y}`;Y.startsWith("@@")&&(Y=Symbol[Y.substring(2)]),$e&&Yt.registeredClass.pureVirtualFunctions.push(Y);function Zt(){fc(`Cannot call ${cn} due to unbound types`,mt)}var sn=Yt.registeredClass.instancePrototype,Cn=sn[Y];return Cn===void 0||Cn.overloadTable===void 0&&Cn.className!==Yt.name&&Cn.argCount===se-2?(Zt.argCount=se-2,Zt.className=Yt.name,sn[Y]=Zt):(aI(sn,Y,cn),sn[Y].overloadTable[se-2]=Zt),gu([],mt,function(pl){var ml=Jc(cn,pl,Yt,ze,Ke,it);return sn[Y].overloadTable===void 0?(ml.argCount=se-2,sn[Y]=ml):sn[Y].overloadTable[se-2]=ml,[]}),[]})}function qd(){Object.assign(II.prototype,{get(b){return this.allocated[b]},has(b){return this.allocated[b]!==void 0},allocate(b){var Y=this.freelist.pop()||this.allocated.length;return this.allocated[Y]=b,Y},free(b){this.allocated[b]=void 0,this.freelist.push(b)}})}function II(){this.allocated=[void 0],this.freelist=[]}var Js=new II;function Ic(b){b>>>=0,b>=Js.reserved&&--Js.get(b).refcount===0&&Js.free(b)}function Kd(){for(var b=0,Y=Js.reserved;Y<Js.allocated.length;++Y)Js.allocated[Y]!==void 0&&++b;return b}function Qd(){Js.allocated.push({value:void 0},{value:null},{value:!0},{value:!1}),Js.reserved=Js.allocated.length,te.count_emval_handles=Kd}var Fl={toValue:b=>(b||cl("Cannot use deleted val. handle = "+b),Js.get(b).value),toHandle:b=>{switch(b){case void 0:return 1;case null:return 2;case!0:return 3;case!1:return 4;default:return Js.allocate({refcount:1,value:b})}}};function $d(b,Y){b>>>=0,Y>>>=0,Y=gs(Y),Pu(b,{name:Y,fromWireType:function(se){var fe=Fl.toValue(se);return Ic(se),fe},toWireType:function(se,fe){return Fl.toHandle(fe)},argPackAdvance:8,readValueFromPointer:ii,destructorFunction:null})}function Xc(b){if(b===null)return"null";var Y=typeof b;return Y==="object"||Y==="array"||Y==="function"?b.toString():""+b}function Zd(b,Y){switch(Y){case 2:return function(se){return this.fromWireType(ee()[se>>>2])};case 3:return function(se){return this.fromWireType(J()[se>>>3])};default:throw new TypeError("Unknown float type: "+b)}}function Jd(b,Y,se){b>>>=0,Y>>>=0,se>>>=0;var fe=ic(se);Y=gs(Y),Pu(b,{name:Y,fromWireType:function(Pe){return Pe},toWireType:function(Pe,ze){return ze},argPackAdvance:8,readValueFromPointer:Zd(Y,fe),destructorFunction:null})}function vc(b,Y,se,fe,Pe,ze,Ke){b>>>=0,se>>>=0,fe>>>=0,Pe>>>=0,ze>>>=0;var $e=Zc(Y,se);b=gs(b),Pe=Us(fe,Pe),iI(b,function(){fc(`Cannot call ${b} due to unbound types`,$e)},Y-1),gu([],$e,function(it){var mt=[it[0],null].concat(it.slice(1));return cI(b,Jc(b,mt,null,Pe,ze,Ke),Y-1),[]})}function Xd(b,Y,se){switch(Y){case 0:return se?function(Pe){return y()[Pe>>>0]}:function(Pe){return A()[Pe>>>0]};case 1:return se?function(Pe){return g()[Pe>>>1]}:function(Pe){return U()[Pe>>>1]};case 2:return se?function(Pe){return _()[Pe>>>2]}:function(Pe){return Q()[Pe>>>2]};default:throw new TypeError("Unknown integer type: "+b)}}function Fi(b,Y,se,fe,Pe){b>>>=0,Y>>>=0,se>>>=0,Y=gs(Y);var ze=ic(se),Ke=cn=>cn;if(fe===0){var $e=32-8*se;Ke=cn=>cn<<$e>>>$e}var it=Y.includes("unsigned"),mt=(cn,Zt)=>{},Yt;it?Yt=function(cn,Zt){return mt(Zt,this.name),Zt>>>0}:Yt=function(cn,Zt){return mt(Zt,this.name),Zt},Pu(b,{name:Y,fromWireType:Ke,toWireType:Yt,argPackAdvance:8,readValueFromPointer:Xd(Y,ze,fe!==0),destructorFunction:null})}function vd(b,Y,se){b>>>=0,se>>>=0;var fe=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array],Pe=fe[Y];function ze(Ke){Ke=Ke>>2;var $e=Q(),it=$e[Ke>>>0],mt=$e[Ke+1>>>0];return new Pe($e.buffer,mt,it)}se=gs(se),Pu(b,{name:se,fromWireType:ze,argPackAdvance:8,readValueFromPointer:ze},{ignoreDuplicateRegistrations:!0})}var wl=(b,Y,se)=>O3(b,A(),Y,se);function e1(b,Y){b>>>=0,Y>>>=0,Y=gs(Y);var se=Y==="std::string";Pu(b,{name:Y,fromWireType:function(fe){var Pe=Q()[fe>>>2],ze=fe+4,Ke;if(se)for(var $e=ze,it=0;it<=Pe;++it){var mt=ze+it;if(it==Pe||A()[mt>>>0]==0){var Yt=mt-$e,cn=pt($e,Yt);Ke===void 0?Ke=cn:(Ke+="\0",Ke+=cn),$e=mt+1}}else{for(var Zt=new Array(Pe),it=0;it<Pe;++it)Zt[it]=String.fromCharCode(A()[ze+it>>>0]);Ke=Zt.join("")}return Gi(fe),Ke},toWireType:function(fe,Pe){Pe instanceof ArrayBuffer&&(Pe=new Uint8Array(Pe));var ze,Ke=typeof Pe=="string";Ke||Pe instanceof Uint8Array||Pe instanceof Uint8ClampedArray||Pe instanceof Int8Array||cl("Cannot pass non-string to std::string"),se&&Ke?ze=yd(Pe):ze=Pe.length;var $e=x3(4+ze+1),it=$e+4;if(Q()[$e>>>2]=ze,se&&Ke)wl(Pe,it,ze+1);else if(Ke)for(var mt=0;mt<ze;++mt){var Yt=Pe.charCodeAt(mt);Yt>255&&(Gi(it),cl("String has UTF-16 code units that do not fit in 8 bits")),A()[it+mt>>>0]=Yt}else for(var mt=0;mt<ze;++mt)A()[it+mt>>>0]=Pe[mt];return fe!==null&&fe.push(Gi,$e),$e},argPackAdvance:8,readValueFromPointer:ii,destructorFunction:function(fe){Gi(fe)}})}var eh=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,Cu=(b,Y)=>{for(var se=b,fe=se>>1,Pe=fe+Y/2;!(fe>=Pe)&&U()[fe>>>0];)++fe;if(se=fe<<1,se-b>32&&eh)return eh.decode(A().slice(b,se));for(var ze="",Ke=0;!(Ke>=Y/2);++Ke){var $e=g()[b+Ke*2>>>1];if($e==0)break;ze+=String.fromCharCode($e)}return ze},th=(b,Y,se)=>{if(se===void 0&&(se=2147483647),se<2)return 0;se-=2;for(var fe=Y,Pe=se<b.length*2?se/2:b.length,ze=0;ze<Pe;++ze){var Ke=b.charCodeAt(ze);g()[Y>>>1]=Ke,Y+=2}return g()[Y>>>1]=0,Y-fe},dc=b=>b.length*2,t1=(b,Y)=>{for(var se=0,fe="";!(se>=Y/4);){var Pe=_()[b+se*4>>>2];if(Pe==0)break;if(++se,Pe>=65536){var ze=Pe-65536;fe+=String.fromCharCode(55296|ze>>10,56320|ze&1023)}else fe+=String.fromCharCode(Pe)}return fe},qa=(b,Y,se)=>{if(Y>>>=0,se===void 0&&(se=2147483647),se<4)return 0;for(var fe=Y,Pe=fe+se-4,ze=0;ze<b.length;++ze){var Ke=b.charCodeAt(ze);if(Ke>=55296&&Ke<=57343){var $e=b.charCodeAt(++ze);Ke=65536+((Ke&1023)<<10)|$e&1023}if(_()[Y>>>2]=Ke,Y+=4,Y+4>Pe)break}return _()[Y>>>2]=0,Y-fe},dI=b=>{for(var Y=0,se=0;se<b.length;++se){var fe=b.charCodeAt(se);fe>=55296&&fe<=57343&&++se,Y+=4}return Y},kn=function(b,Y,se){b>>>=0,Y>>>=0,se>>>=0,se=gs(se);var fe,Pe,ze,Ke,$e;Y===2?(fe=Cu,Pe=th,Ke=dc,ze=()=>U(),$e=1):Y===4&&(fe=t1,Pe=qa,Ke=dI,ze=()=>Q(),$e=2),Pu(b,{name:se,fromWireType:function(it){for(var mt=Q()[it>>>2],Yt=ze(),cn,Zt=it+4,sn=0;sn<=mt;++sn){var Cn=it+4+sn*Y;if(sn==mt||Yt[Cn>>>$e]==0){var pl=Cn-Zt,ml=fe(Zt,pl);cn===void 0?cn=ml:(cn+="\0",cn+=ml),Zt=Cn+Y}}return Gi(it),cn},toWireType:function(it,mt){typeof mt!="string"&&cl(`Cannot pass non-string to C++ string type ${se}`);var Yt=Ke(mt),cn=x3(4+Yt+Y);return Q()[cn>>>2]=Yt>>$e,Pe(mt,cn+4,Yt+Y),it!==null&&it.push(Gi,cn),cn},argPackAdvance:8,readValueFromPointer:ii,destructorFunction:function(it){Gi(it)}})};function n1(b,Y,se,fe,Pe,ze){b>>>=0,Y>>>=0,se>>>=0,fe>>>=0,Pe>>>=0,ze>>>=0,Os[b]={name:gs(Y),rawConstructor:Us(se,fe),rawDestructor:Us(Pe,ze),elements:[]}}function l1(b,Y,se,fe,Pe,ze,Ke,$e,it){b>>>=0,Y>>>=0,se>>>=0,fe>>>=0,Pe>>>=0,ze>>>=0,Ke>>>=0,$e>>>=0,it>>>=0,Os[b].elements.push({getterReturnType:Y,getter:Us(se,fe),getterContext:Pe,setterArgumentType:ze,setter:Us(Ke,$e),setterContext:it})}function s1(b,Y,se,fe,Pe,ze){b>>>=0,Y>>>=0,se>>>=0,fe>>>=0,Pe>>>=0,ze>>>=0,ac[b]={name:gs(Y),rawConstructor:Us(se,fe),rawDestructor:Us(Pe,ze),fields:[]}}function r1(b,Y,se,fe,Pe,ze,Ke,$e,it,mt){b>>>=0,Y>>>=0,se>>>=0,fe>>>=0,Pe>>>=0,ze>>>=0,Ke>>>=0,$e>>>=0,it>>>=0,mt>>>=0,ac[b].fields.push({fieldName:gs(Y),getterReturnType:se,getter:Us(fe,Pe),getterContext:ze,setterArgumentType:Ke,setter:Us($e,it),setterContext:mt})}function u1(b,Y){b>>>=0,Y>>>=0,Y=gs(Y),Pu(b,{isVoid:!0,name:Y,argPackAdvance:0,fromWireType:function(){},toWireType:function(se,fe){}})}var nh=!0,Me=()=>nh,vu=()=>{if(!Bl())try{Be?C0(Ft):jn(Ft)}catch(b){tl(b)}},a1=b=>{if(!Ct)try{b(),vu()}catch(Y){tl(Y)}};function lh(b){if(b>>>=0,typeof Atomics.waitAsync=="function"){var Y=Atomics.waitAsync(_(),b>>2,b);Y.value.then(yc);var se=b+128;Atomics.store(_(),se>>2,1)}}te.__emscripten_thread_mailbox_await=lh;var yc=function(){var b=M3();b&&(lh(b),a1(()=>o5()))};te.checkMailbox=yc;var i1=function(b,Y,se){if(b>>>=0,Y>>>=0,b==Y)setTimeout(()=>yc());else if(Be)postMessage({targetThread:b,cmd:"checkMailbox"});else{var fe=$t.pthreads[b];if(!fe)return;fe.postMessage({cmd:"checkMailbox"})}};function o1(b,Y,se){return-1}function c1(b){}function sh(b,Y){var se=Hs[b];return se===void 0&&cl(Y+" has unknown type "+fI(b)),se}function h1(b,Y,se){b>>>=0,Y>>>=0,se>>>=0,b=Fl.toValue(b),Y=sh(Y,"emval::as");var fe=[],Pe=Fl.toHandle(fe);return Q()[se>>>2]=Pe,Y.toWireType(fe,b)}function f1(b,Y){for(var se=new Array(b),fe=0;fe<b;++fe)se[fe]=sh(Q()[Y+fe*4>>>2],"parameter "+fe);return se}function I1(b,Y,se,fe){b>>>=0,se>>>=0,fe>>>=0,b=Fl.toValue(b);for(var Pe=f1(Y,se),ze=new Array(Y),Ke=0;Ke<Y;++Ke){var $e=Pe[Ke];ze[Ke]=$e.readValueFromPointer(fe),fe+=$e.argPackAdvance}var it=b.apply(void 0,ze);return Fl.toHandle(it)}var yI={};function rh(b){var Y=yI[b];return Y===void 0?gs(b):Y}function wI(){return typeof globalThis=="object"?globalThis:function(){return Function}()("return this")()}function d1(b){return b>>>=0,b===0?Fl.toHandle(wI()):(b=rh(b),Fl.toHandle(wI()[b]))}function y1(b,Y){return b>>>=0,Y>>>=0,b=Fl.toValue(b),Y=Fl.toValue(Y),Fl.toHandle(b[Y])}function w1(b){b>>>=0,b>4&&(Js.get(b).refcount+=1)}function EI(b,Y){return b>>>=0,Y>>>=0,b=Fl.toValue(b),Y=Fl.toValue(Y),b instanceof Y}function wc(b){return b>>>=0,b=Fl.toValue(b),typeof b=="number"}function Ec(b){return b>>>=0,b=Fl.toValue(b),typeof b=="string"}function E1(){return Fl.toHandle([])}function Tc(b){return b>>>=0,Fl.toHandle(rh(b))}function TI(){return Fl.toHandle({})}function Mu(b){b>>>=0;var Y=Fl.toValue(b);Zu(Y),Ic(b)}function pI(b,Y,se){b>>>=0,Y>>>=0,se>>>=0,b=Fl.toValue(b),Y=Fl.toValue(Y),se=Fl.toValue(se),b[Y]=se}function T1(b,Y){b>>>=0,Y>>>=0,b=sh(b,"_emval_take_value");var se=b.readValueFromPointer(Y);return Fl.toHandle(se)}function pc(b,Y,se){var fe=Ou(b,Y);se>>>=0;var Pe=new Date(fe*1e3);_()[se>>>2]=Pe.getUTCSeconds(),_()[se+4>>>2]=Pe.getUTCMinutes(),_()[se+8>>>2]=Pe.getUTCHours(),_()[se+12>>>2]=Pe.getUTCDate(),_()[se+16>>>2]=Pe.getUTCMonth(),_()[se+20>>>2]=Pe.getUTCFullYear()-1900,_()[se+24>>>2]=Pe.getUTCDay();var ze=Date.UTC(Pe.getUTCFullYear(),0,1,0,0,0,0),Ke=(Pe.getTime()-ze)/(1e3*60*60*24)|0;_()[se+28>>>2]=Ke}var ci=b=>b%4===0&&(b%100!==0||b%400===0),H=[0,31,60,91,121,152,182,213,244,274,305,335],k=[0,31,59,90,120,151,181,212,243,273,304,334],ue=b=>{var Y=ci(b.getFullYear()),se=Y?H:k,fe=se[b.getMonth()]+b.getDate()-1;return fe};function we(b,Y,se){var fe=Ou(b,Y);se>>>=0;var Pe=new Date(fe*1e3);_()[se>>>2]=Pe.getSeconds(),_()[se+4>>>2]=Pe.getMinutes(),_()[se+8>>>2]=Pe.getHours(),_()[se+12>>>2]=Pe.getDate(),_()[se+16>>>2]=Pe.getMonth(),_()[se+20>>>2]=Pe.getFullYear()-1900,_()[se+24>>>2]=Pe.getDay();var ze=ue(Pe)|0;_()[se+28>>>2]=ze,_()[se+36>>>2]=-(Pe.getTimezoneOffset()*60);var Ke=new Date(Pe.getFullYear(),0,1),$e=new Date(Pe.getFullYear(),6,1).getTimezoneOffset(),it=Ke.getTimezoneOffset(),mt=($e!=it&&Pe.getTimezoneOffset()==Math.min(it,$e))|0;_()[se+32>>>2]=mt}var Ce=b=>{var Y=yd(b)+1,se=x3(Y);return se&&wl(b,se,Y),se};function qe(b,Y,se){b>>>=0,Y>>>=0,se>>>=0;var fe=new Date().getFullYear(),Pe=new Date(fe,0,1),ze=new Date(fe,6,1),Ke=Pe.getTimezoneOffset(),$e=ze.getTimezoneOffset(),it=Math.max(Ke,$e);Q()[b>>>2]=it*60,_()[Y>>>2]=+(Ke!=$e);function mt(Cn){var pl=Cn.toTimeString().match(/\(([A-Za-z ]+)\)$/);return pl?pl[1]:"GMT"}var Yt=mt(Pe),cn=mt(ze),Zt=Ce(Yt),sn=Ce(cn);$e<Ke?(Q()[se>>>2]=Zt,Q()[se+4>>>2]=sn):(Q()[se>>>2]=sn,Q()[se+4>>>2]=Zt)}var Ze=()=>{Hn("")};function ve(){}function ot(){return Date.now()}var Et=()=>{wn+=1},_t=()=>{throw Et(),"unwind"},ln;ln=()=>performance.timeOrigin+performance.now();var Qt=b=>{var Y=h5(),se=b();return M0(Y),se},kt=function(b,Y){var se=arguments.length-2,fe=arguments;return Qt(()=>{for(var Pe=se,ze=f5(Pe*8),Ke=ze>>3,$e=0;$e<se;$e++){var it=fe[2+$e];J()[Ke+$e>>>0]=it}return i5(b,Pe,ze,Y)})},Rn=[];function ul(b,Y,se,fe){Y>>>=0,fe>>>=0,$t.currentProxiedOperationCallerThread=Y,Rn.length=se;for(var Pe=fe>>3,ze=0;ze<se;ze++)Rn[ze]=J()[Pe+ze>>>0];var Ke=G2[b];return Ke.apply(null,Rn)}var ol=()=>4294901760,El=b=>{var Y=ft.buffer,se=b-Y.byteLength+65535>>>16;try{return ft.grow(se),yn(),1}catch{}};function Mt(b){b>>>=0;var Y=A().length;if(b<=Y)return!1;var se=ol();if(b>se)return!1;for(var fe=(it,mt)=>it+(mt-it%mt)%mt,Pe=1;Pe<=4;Pe*=2){var ze=Y*(1+.2/Pe);ze=Math.min(ze,b+100663296);var Ke=Math.min(se,fe(Math.max(b,ze),65536)),$e=El(Ke);if($e)return!0}return!1}var un={},Ts=()=>ie||"./this.program",hl=()=>{if(!hl.strings){var b=(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",Y={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:b,_:Ts()};for(var se in un)un[se]===void 0?delete Y[se]:Y[se]=un[se];var fe=[];for(var se in Y)fe.push(`${se}=${Y[se]}`);hl.strings=fe}return hl.strings},Xs=(b,Y)=>{for(var se=0;se<b.length;++se)y()[Y++>>>0]=b.charCodeAt(se);y()[Y>>>0]=0};function ts(b,Y){if(Be)return kt(3,1,b,Y);b>>>=0,Y>>>=0;var se=0;return hl().forEach(function(fe,Pe){var ze=Y+se;Q()[b+Pe*4>>>2]=ze,Xs(fe,ze),se+=fe.length+1}),0}function Zy(b,Y){if(Be)return kt(4,1,b,Y);b>>>=0,Y>>>=0;var se=hl();Q()[b>>>2]=se.length;var fe=0;return se.forEach(function(Pe){fe+=Pe.length+1}),Q()[Y>>>2]=fe,0}function Jy(b){if(Be)return kt(5,1,b);try{var Y=an.getStreamFromFD(b);return ye.close(Y),0}catch(se){if(typeof ye>"u"||se.name!=="ErrnoError")throw se;return se.errno}}function Xy(b,Y){if(Be)return kt(6,1,b,Y);Y>>>=0;try{var se=0,fe=0,Pe=0,ze=an.getStreamFromFD(b),Ke=ze.tty?2:ye.isDir(ze.mode)?3:ye.isLink(ze.mode)?7:4;return y()[Y>>>0]=Ke,g()[Y+2>>>1]=Pe,En=[se>>>0,(hn=se,+Math.abs(hn)>=1?hn>0?+Math.floor(hn/4294967296)>>>0:~~+Math.ceil((hn-+(~~hn>>>0))/4294967296)>>>0:0)],_()[Y+8>>>2]=En[0],_()[Y+12>>>2]=En[1],En=[fe>>>0,(hn=fe,+Math.abs(hn)>=1?hn>0?+Math.floor(hn/4294967296)>>>0:~~+Math.ceil((hn-+(~~hn>>>0))/4294967296)>>>0:0)],_()[Y+16>>>2]=En[0],_()[Y+20>>>2]=En[1],0}catch($e){if(typeof ye>"u"||$e.name!=="ErrnoError")throw $e;return $e.errno}}var b3=(b,Y,se,fe)=>{for(var Pe=0,ze=0;ze<se;ze++){var Ke=Q()[Y>>>2],$e=Q()[Y+4>>>2];Y+=8;var it=ye.read(b,y(),Ke,$e,fe);if(it<0)return-1;if(Pe+=it,it<$e)break}return Pe};function vy(b,Y,se,fe){if(Be)return kt(7,1,b,Y,se,fe);Y>>>=0,se>>>=0,fe>>>=0;try{var Pe=an.getStreamFromFD(b),ze=b3(Pe,Y,se);return Q()[fe>>>2]=ze,0}catch(Ke){if(typeof ye>"u"||Ke.name!=="ErrnoError")throw Ke;return Ke.errno}}function e5(b,Y,se,fe,Pe){if(Be)return kt(8,1,b,Y,se,fe,Pe);var ze=Ou(Y,se);Pe>>>=0;try{if(isNaN(ze))return 61;var Ke=an.getStreamFromFD(b);return ye.llseek(Ke,ze,fe),En=[Ke.position>>>0,(hn=Ke.position,+Math.abs(hn)>=1?hn>0?+Math.floor(hn/4294967296)>>>0:~~+Math.ceil((hn-+(~~hn>>>0))/4294967296)>>>0:0)],_()[Pe>>>2]=En[0],_()[Pe+4>>>2]=En[1],Ke.getdents&&ze===0&&fe===0&&(Ke.getdents=null),0}catch($e){if(typeof ye>"u"||$e.name!=="ErrnoError")throw $e;return $e.errno}}var t5=(b,Y,se,fe)=>{for(var Pe=0,ze=0;ze<se;ze++){var Ke=Q()[Y>>>2],$e=Q()[Y+4>>>2];Y+=8;var it=ye.write(b,y(),Ke,$e,fe);if(it<0)return-1;Pe+=it}return Pe};function n5(b,Y,se,fe){if(Be)return kt(9,1,b,Y,se,fe);Y>>>=0,se>>>=0,fe>>>=0;try{var Pe=an.getStreamFromFD(b),ze=t5(Pe,Y,se);return Q()[fe>>>2]=ze,0}catch(Ke){if(typeof ye>"u"||Ke.name!=="ErrnoError")throw Ke;return Ke.errno}}var H2=(b,Y)=>{for(var se=0,fe=0;fe<=Y;se+=b[fe++]);return se},l5=[31,29,31,30,31,30,31,31,30,31,30,31],s5=[31,28,31,30,31,30,31,31,30,31,30,31],B2=(b,Y)=>{for(var se=new Date(b.getTime());Y>0;){var fe=ci(se.getFullYear()),Pe=se.getMonth(),ze=(fe?l5:s5)[Pe];if(Y>ze-se.getDate())Y-=ze-se.getDate()+1,se.setDate(1),Pe<11?se.setMonth(Pe+1):(se.setMonth(0),se.setFullYear(se.getFullYear()+1));else return se.setDate(se.getDate()+Y),se}return se},U2=(b,Y)=>{y().set(b,Y>>>0)};function F2(b,Y,se,fe){b>>>=0,Y>>>=0,se>>>=0,fe>>>=0;var Pe=_()[fe+40>>>2],ze={tm_sec:_()[fe>>>2],tm_min:_()[fe+4>>>2],tm_hour:_()[fe+8>>>2],tm_mday:_()[fe+12>>>2],tm_mon:_()[fe+16>>>2],tm_year:_()[fe+20>>>2],tm_wday:_()[fe+24>>>2],tm_yday:_()[fe+28>>>2],tm_isdst:_()[fe+32>>>2],tm_gmtoff:_()[fe+36>>>2],tm_zone:Pe?pt(Pe):""},Ke=pt(se),$e={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var it in $e)Ke=Ke.replace(new RegExp(it,"g"),$e[it]);var mt=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Yt=["January","February","March","April","May","June","July","August","September","October","November","December"];function cn(xt,rn,Ws){for(var Ml=typeof xt=="number"?xt.toString():xt||"";Ml.length<rn;)Ml=Ws[0]+Ml;return Ml}function Zt(xt,rn){return cn(xt,rn,"0")}function sn(xt,rn){function Ws(ea){return ea<0?-1:ea>0?1:0}var Ml;return(Ml=Ws(xt.getFullYear()-rn.getFullYear()))===0&&(Ml=Ws(xt.getMonth()-rn.getMonth()))===0&&(Ml=Ws(xt.getDate()-rn.getDate())),Ml}function Cn(xt){switch(xt.getDay()){case 0:return new Date(xt.getFullYear()-1,11,29);case 1:return xt;case 2:return new Date(xt.getFullYear(),0,3);case 3:return new Date(xt.getFullYear(),0,2);case 4:return new Date(xt.getFullYear(),0,1);case 5:return new Date(xt.getFullYear()-1,11,31);case 6:return new Date(xt.getFullYear()-1,11,30)}}function pl(xt){var rn=B2(new Date(xt.tm_year+1900,0,1),xt.tm_yday),Ws=new Date(rn.getFullYear(),0,4),Ml=new Date(rn.getFullYear()+1,0,4),ea=Cn(Ws),ls=Cn(Ml);return sn(ea,rn)<=0?sn(ls,rn)<=0?rn.getFullYear()+1:rn.getFullYear():rn.getFullYear()-1}var ml={"%a":xt=>mt[xt.tm_wday].substring(0,3),"%A":xt=>mt[xt.tm_wday],"%b":xt=>Yt[xt.tm_mon].substring(0,3),"%B":xt=>Yt[xt.tm_mon],"%C":xt=>{var rn=xt.tm_year+1900;return Zt(rn/100|0,2)},"%d":xt=>Zt(xt.tm_mday,2),"%e":xt=>cn(xt.tm_mday,2," "),"%g":xt=>pl(xt).toString().substring(2),"%G":xt=>pl(xt),"%H":xt=>Zt(xt.tm_hour,2),"%I":xt=>{var rn=xt.tm_hour;return rn==0?rn=12:rn>12&&(rn-=12),Zt(rn,2)},"%j":xt=>Zt(xt.tm_mday+H2(ci(xt.tm_year+1900)?l5:s5,xt.tm_mon-1),3),"%m":xt=>Zt(xt.tm_mon+1,2),"%M":xt=>Zt(xt.tm_min,2),"%n":()=>`
`,"%p":xt=>xt.tm_hour>=0&&xt.tm_hour<12?"AM":"PM","%S":xt=>Zt(xt.tm_sec,2),"%t":()=>"	","%u":xt=>xt.tm_wday||7,"%U":xt=>{var rn=xt.tm_yday+7-xt.tm_wday;return Zt(Math.floor(rn/7),2)},"%V":xt=>{var rn=Math.floor((xt.tm_yday+7-(xt.tm_wday+6)%7)/7);if((xt.tm_wday+371-xt.tm_yday-2)%7<=2&&rn++,rn){if(rn==53){var Ml=(xt.tm_wday+371-xt.tm_yday)%7;Ml!=4&&(Ml!=3||!ci(xt.tm_year))&&(rn=1)}}else{rn=52;var Ws=(xt.tm_wday+7-xt.tm_yday-1)%7;(Ws==4||Ws==5&&ci(xt.tm_year%400-1))&&rn++}return Zt(rn,2)},"%w":xt=>xt.tm_wday,"%W":xt=>{var rn=xt.tm_yday+7-(xt.tm_wday+6)%7;return Zt(Math.floor(rn/7),2)},"%y":xt=>(xt.tm_year+1900).toString().substring(2),"%Y":xt=>xt.tm_year+1900,"%z":xt=>{var rn=xt.tm_gmtoff,Ws=rn>=0;return rn=Math.abs(rn)/60,rn=rn/60*100+rn%60,(Ws?"+":"-")+("0000"+rn).slice(-4)},"%Z":xt=>xt.tm_zone,"%%":()=>"%"};Ke=Ke.replace(/%%/g,"\0\0");for(var it in ml)Ke.includes(it)&&(Ke=Ke.replace(new RegExp(it,"g"),ml[it](ze)));Ke=Ke.replace(/\0\0/g,"%");var Gl=uc(Ke,!1);return Gl.length>Y?0:(U2(Gl,b),Gl.length-1)}function r5(b,Y,se,fe,Pe){return b>>>=0,Y>>>=0,se>>>=0,fe>>>=0,F2(b,Y,se,fe)}$t.init();var RI=function(b,Y,se,fe){b||(b=this),this.parent=b,this.mount=b.mount,this.mounted=null,this.id=ye.nextInode++,this.name=Y,this.mode=se,this.node_ops={},this.stream_ops={},this.rdev=fe},p1=365,C3=146;Object.defineProperties(RI.prototype,{read:{get:function(){return(this.mode&p1)===p1},set:function(b){b?this.mode|=p1:this.mode&=~p1}},write:{get:function(){return(this.mode&C3)===C3},set:function(b){b?this.mode|=C3:this.mode&=~C3}},isFolder:{get:function(){return ye.isDir(this.mode)}},isDevice:{get:function(){return ye.isChrdev(this.mode)}}}),ye.FSNode=RI,ye.createPreloadedFile=ke,ye.staticInit(),Td=te.InternalError=class extends Error{constructor(Y){super(Y),this.name="InternalError"}},tI(),Ju=te.BindingError=class extends Error{constructor(Y){super(Y),this.name="BindingError"}},bd(),kc(),oI(),hI=te.UnboundTypeError=jd(Error,"UnboundTypeError"),qd(),Qd();var G2=[null,Nn,Iu,ts,Zy,Jy,Xy,vy,e5,n5],P0={g:P3,Y:Vc,B:Ed,fa:pd,r:Bs,K:Rd,da:md,q:Yd,p:Ui,c:kd,ca:$d,D:Jd,d:vc,t:Fi,l:vd,E:e1,y:kn,ga:n1,m:l1,s:s1,f:r1,ea:u1,T:Me,R:i1,W:o1,X:lh,ba:c1,k:h1,x:I1,b:Ic,A:d1,i:y1,o:w1,G:EI,z:wc,F:Ec,ha:E1,h:Tc,v:TI,j:Mu,n:pI,e:T1,I:pc,J:we,Q:qe,w:Ze,C:ve,U:ot,aa:_t,u:ln,V:ul,P:Mt,_:ts,$:Zy,L:jn,N:Jy,Z:Xy,O:vy,H:e5,S:n5,a:ft||te.wasmMemory,M:r5};Pl();var M3=te._pthread_self=()=>(M3=te._pthread_self=Nt.ja)(),x3=b=>(x3=Nt.la)(b);te.__emscripten_tls_init=()=>(te.__emscripten_tls_init=Nt.ma)();var u5=b=>(u5=Nt.na)(b);te.__embind_initialize_bindings=()=>(te.__embind_initialize_bindings=Nt.oa)();var a5=te.__emscripten_thread_init=(b,Y,se,fe,Pe,ze)=>(a5=te.__emscripten_thread_init=Nt.pa)(b,Y,se,fe,Pe,ze);te.__emscripten_thread_crashed=()=>(te.__emscripten_thread_crashed=Nt.qa)();var i5=(b,Y,se,fe)=>(i5=Nt.ra)(b,Y,se,fe),Gi=b=>(Gi=Nt.sa)(b),b0=b=>(b0=Nt.ta)(b),C0=te.__emscripten_thread_exit=b=>(C0=te.__emscripten_thread_exit=Nt.ua)(b),o5=te.__emscripten_check_mailbox=()=>(o5=te.__emscripten_check_mailbox=Nt.va)(),c5=(b,Y)=>(c5=Nt.wa)(b,Y),h5=()=>(h5=Nt.xa)(),M0=b=>(M0=Nt.ya)(b),f5=b=>(f5=Nt.za)(b),I5=b=>(I5=Nt.Aa)(b);te.dynCall_jiji=(b,Y,se,fe,Pe)=>(te.dynCall_jiji=Nt.Ba)(b,Y,se,fe,Pe),te.dynCall_viijii=(b,Y,se,fe,Pe,ze,Ke)=>(te.dynCall_viijii=Nt.Ca)(b,Y,se,fe,Pe,ze,Ke),te.dynCall_iiiiij=(b,Y,se,fe,Pe,ze,Ke)=>(te.dynCall_iiiiij=Nt.Da)(b,Y,se,fe,Pe,ze,Ke),te.dynCall_iiiiijj=(b,Y,se,fe,Pe,ze,Ke,$e,it)=>(te.dynCall_iiiiijj=Nt.Ea)(b,Y,se,fe,Pe,ze,Ke,$e,it),te.dynCall_iiiiiijj=(b,Y,se,fe,Pe,ze,Ke,$e,it,mt)=>(te.dynCall_iiiiiijj=Nt.Fa)(b,Y,se,fe,Pe,ze,Ke,$e,it,mt);function _2(b){b=Object.assign({},b);var Y=fe=>()=>fe()>>>0,se=fe=>Pe=>fe(Pe)>>>0;return b.pthread_self=Y(b.pthread_self),b.malloc=se(b.malloc),b.__getTypeName=se(b.__getTypeName),b.__errno_location=Y(b.__errno_location),b.stackSave=Y(b.stackSave),b.stackAlloc=se(b.stackAlloc),b}te.keepRuntimeAlive=Bl,te.wasmMemory=ft,te.ExitStatus=Jt,te.PThread=$t;var H3;Sn=function b(){H3||B3(),H3||(Sn=b)};function B3(){if(Wt>0)return;if(Be){he(te),Ye(),startWorker(te);return}if(sl(),Wt>0)return;function b(){H3||(H3=!0,te.calledRun=!0,!Ct&&(Ye(),he(te),te.onRuntimeInitialized&&te.onRuntimeInitialized(),We()))}te.setStatus?(te.setStatus("Running..."),setTimeout(function(){setTimeout(function(){te.setStatus("")},1),b()},1)):b()}if(te.preInit)for(typeof te.preInit=="function"&&(te.preInit=[te.preInit]);te.preInit.length>0;)te.preInit.pop()();return B3(),c.ready}})();typeof e=="object"&&typeof l=="object"?l.exports=n:typeof define=="function"&&define.amd&&define([],()=>n)}}),gj=zY({"dist/web-ifc.js"(e,l){var n=(()=>{var t=typeof document<"u"&&document.currentScript?document.currentScript.src:void 0;return function(c={}){var y=c,A,g;y.ready=new Promise((H,k)=>{A=H,g=k});var U=Object.assign({},y),_="./this.program",Q=!0,ee="";function J(H){return y.locateFile?y.locateFile(H,ee):ee+H}var te,he;typeof document<"u"&&document.currentScript&&(ee=document.currentScript.src),t&&(ee=t),ee.indexOf("blob:")!==0?ee=ee.substr(0,ee.replace(/[?#].*/,"").lastIndexOf("/")+1):ee="",te=H=>{var k=new XMLHttpRequest;return k.open("GET",H,!1),k.send(null),k.responseText},he=(H,k,ue)=>{var we=new XMLHttpRequest;we.open("GET",H,!0),we.responseType="arraybuffer",we.onload=()=>{if(we.status==200||we.status==0&&we.response){k(we.response);return}ue()},we.onerror=ue,we.send(null)};var de=y.print||console.log.bind(console),oe=y.printErr||console.error.bind(console);Object.assign(y,U),U=null,y.arguments&&y.arguments,y.thisProgram&&(_=y.thisProgram),y.quit&&y.quit;var ie;y.wasmBinary&&(ie=y.wasmBinary),y.noExitRuntime,typeof WebAssembly!="object"&&yn("no native wasm support detected");var Re,Ie,Ne=!1;function je(H,k){H||yn(k)}var Be,Fe,Je,ge,Le,Xe,lt,ht;function et(){var H=Re.buffer;y.HEAP8=Be=new Int8Array(H),y.HEAP16=Je=new Int16Array(H),y.HEAP32=Le=new Int32Array(H),y.HEAPU8=Fe=new Uint8Array(H),y.HEAPU16=ge=new Uint16Array(H),y.HEAPU32=Xe=new Uint32Array(H),y.HEAPF32=lt=new Float32Array(H),y.HEAPF64=ht=new Float64Array(H)}var at,ft=[],Nt=[],bt=[];function Ct(){if(y.preRun)for(typeof y.preRun=="function"&&(y.preRun=[y.preRun]);y.preRun.length;)Ut(y.preRun.shift());Dt(ft)}function Ft(){!y.noFSInit&&!Me.init.initialized&&Me.init(),Me.ignorePermissions=!1,Dt(Nt)}function Ht(){if(y.postRun)for(typeof y.postRun=="function"&&(y.postRun=[y.postRun]);y.postRun.length;)Bt(y.postRun.shift());Dt(bt)}function Ut(H){ft.unshift(H)}function Lt(H){Nt.unshift(H)}function Bt(H){bt.unshift(H)}var Xt=0,mn=null;function An(H){return H}function Un(H){Xt++,y.monitorRunDependencies&&y.monitorRunDependencies(Xt)}function Fn(H){if(Xt--,y.monitorRunDependencies&&y.monitorRunDependencies(Xt),Xt==0&&mn){var k=mn;mn=null,k()}}function yn(H){y.onAbort&&y.onAbort(H),H="Aborted("+H+")",oe(H),Ne=!0,H+=". Build with -sASSERTIONS for more info.";var k=new WebAssembly.RuntimeError(H);throw g(k),k}var el="data:application/octet-stream;base64,";function Tt(H){return H.startsWith(el)}var Xl;Xl="web-ifc.wasm",Tt(Xl)||(Xl=J(Xl));function Mn(H){if(H==Xl&&ie)return new Uint8Array(ie);throw"both async and sync fetching of the wasm failed"}function _n(H){return!ie&&Q&&typeof fetch=="function"?fetch(H,{credentials:"same-origin"}).then(k=>{if(!k.ok)throw"failed to load wasm binary file at '"+H+"'";return k.arrayBuffer()}).catch(()=>Mn(H)):Promise.resolve().then(()=>Mn(H))}function wn(H,k,ue){return _n(H).then(we=>WebAssembly.instantiate(we,k)).then(we=>we).then(ue,we=>{oe("failed to asynchronously prepare wasm: "+we),yn(we)})}function Bl(H,k,ue,we){return!H&&typeof WebAssembly.instantiateStreaming=="function"&&!Tt(k)&&typeof fetch=="function"?fetch(k,{credentials:"same-origin"}).then(Ce=>{var qe=WebAssembly.instantiateStreaming(Ce,ue);return qe.then(we,function(Ze){return oe("wasm streaming compile failed: "+Ze),oe("falling back to ArrayBuffer instantiation"),wn(k,ue,we)})}):wn(k,ue,we)}function sl(){var H={a:E1};function k(we,Ce){var qe=we.exports;return qe=T1(qe),Ie=qe,Re=Ie.Z,et(),at=Ie.$,Lt(Ie._),Fn(),qe}Un();function ue(we){k(we.instance)}if(y.instantiateWasm)try{return y.instantiateWasm(H,k)}catch(we){oe("Module.instantiateWasm callback failed with error: "+we),g(we)}return Bl(ie,Xl,H,ue).catch(g),{}}var Ye,We,Dt=H=>{for(;H.length>0;)H.shift()(y)};function qt(H){this.excPtr=H,this.ptr=H-24,this.set_type=function(k){Xe[this.ptr+4>>>2]=k},this.get_type=function(){return Xe[this.ptr+4>>>2]},this.set_destructor=function(k){Xe[this.ptr+8>>>2]=k},this.get_destructor=function(){return Xe[this.ptr+8>>>2]},this.set_caught=function(k){k=k?1:0,Be[this.ptr+12>>>0]=k},this.get_caught=function(){return Be[this.ptr+12>>>0]!=0},this.set_rethrown=function(k){k=k?1:0,Be[this.ptr+13>>>0]=k},this.get_rethrown=function(){return Be[this.ptr+13>>>0]!=0},this.init=function(k,ue){this.set_adjusted_ptr(0),this.set_type(k),this.set_destructor(ue)},this.set_adjusted_ptr=function(k){Xe[this.ptr+16>>>2]=k},this.get_adjusted_ptr=function(){return Xe[this.ptr+16>>>2]},this.get_exception_ptr=function(){var k=pI(this.get_type());if(k)return Xe[this.excPtr>>>2];var ue=this.get_adjusted_ptr();return ue!==0?ue:this.excPtr}}var zt=0;function Wt(H,k){return k+2097152>>>0<4194305-!!H?(H>>>0)+k*4294967296:NaN}function Sn(H,k,ue){H>>>=0,k>>>=0,ue>>>=0;var we=new qt(H);throw we.init(k,ue),zt=H,zt}var on={};function In(H){for(;H.length;){var k=H.pop(),ue=H.pop();ue(k)}}function bn(H){return this.fromWireType(Le[H>>>2])}var Hn={},Gt={},Rl={},$n=void 0;function Vn(H){throw new $n(H)}function gn(H,k,ue){H.forEach(function(ve){Rl[ve]=k});function we(ve){var ot=ue(ve);ot.length!==H.length&&Vn("Mismatched type converter count");for(var Et=0;Et<H.length;++Et)pn(H[Et],ot[Et])}var Ce=new Array(k.length),qe=[],Ze=0;k.forEach((ve,ot)=>{Gt.hasOwnProperty(ve)?Ce[ot]=Gt[ve]:(qe.push(ve),Hn.hasOwnProperty(ve)||(Hn[ve]=[]),Hn[ve].push(()=>{Ce[ot]=Gt[ve],++Ze,Ze===qe.length&&we(Ce)}))}),qe.length===0&&we(Ce)}function Tn(H){H>>>=0;var k=on[H];delete on[H];var ue=k.elements,we=ue.length,Ce=ue.map(function(ve){return ve.getterReturnType}).concat(ue.map(function(ve){return ve.setterArgumentType})),qe=k.rawConstructor,Ze=k.rawDestructor;gn([H],Ce,function(ve){return ue.forEach((ot,Et)=>{var _t=ve[Et],ln=ot.getter,Qt=ot.getterContext,kt=ve[Et+we],Rn=ot.setter,ul=ot.setterContext;ot.read=ol=>_t.fromWireType(ln(Qt,ol)),ot.write=(ol,El)=>{var Mt=[];Rn(ul,ol,kt.toWireType(Mt,El)),In(Mt)}}),[{name:k.name,fromWireType:function(ot){for(var Et=new Array(we),_t=0;_t<we;++_t)Et[_t]=ue[_t].read(ot);return Ze(ot),Et},toWireType:function(ot,Et){if(we!==Et.length)throw new TypeError(`Incorrect number of tuple elements for ${k.name}: expected=${we}, actual=${Et.length}`);for(var _t=qe(),ln=0;ln<we;++ln)ue[ln].write(_t,Et[ln]);return ot!==null&&ot.push(Ze,_t),_t},argPackAdvance:8,readValueFromPointer:bn,destructorFunction:Ze}]})}var Zn={},Pl=function(H){H>>>=0;var k=Zn[H];delete Zn[H];var ue=k.rawConstructor,we=k.rawDestructor,Ce=k.fields,qe=Ce.map(Ze=>Ze.getterReturnType).concat(Ce.map(Ze=>Ze.setterArgumentType));gn([H],qe,Ze=>{var ve={};return Ce.forEach((ot,Et)=>{var _t=ot.fieldName,ln=Ze[Et],Qt=ot.getter,kt=ot.getterContext,Rn=Ze[Et+Ce.length],ul=ot.setter,ol=ot.setterContext;ve[_t]={read:El=>ln.fromWireType(Qt(kt,El)),write:(El,Mt)=>{var un=[];ul(ol,El,Rn.toWireType(un,Mt)),In(un)}}}),[{name:k.name,fromWireType:function(ot){var Et={};for(var _t in ve)Et[_t]=ve[_t].read(ot);return we(ot),Et},toWireType:function(ot,Et){for(var _t in ve)if(!(_t in Et))throw new TypeError(`Missing field: "${_t}"`);var ln=ue();for(_t in ve)ve[_t].write(ln,Et[_t]);return ot!==null&&ot.push(we,ln),ln},argPackAdvance:8,readValueFromPointer:bn,destructorFunction:we}]})};function hn(H,k,ue,we,Ce){}function En(H){switch(H){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError(`Unknown type size: ${H}`)}}function Jt(){for(var H=new Array(256),k=0;k<256;++k)H[k]=String.fromCharCode(k);ut=H}var ut=void 0;function Kt(H){for(var k="",ue=H;Fe[ue>>>0];)k+=ut[Fe[ue++>>>0]];return k}var tn=void 0;function nn(H){throw new tn(H)}function Bn(H,k,ue={}){var we=k.name;if(H||nn(`type "${we}" must have a positive integer typeid pointer`),Gt.hasOwnProperty(H)){if(ue.ignoreDuplicateRegistrations)return;nn(`Cannot register type '${we}' twice`)}if(Gt[H]=k,delete Rl[H],Hn.hasOwnProperty(H)){var Ce=Hn[H];delete Hn[H],Ce.forEach(qe=>qe())}}function pn(H,k,ue={}){if(!("argPackAdvance"in k))throw new TypeError("registerType registeredInstance requires argPackAdvance");return Bn(H,k,ue)}function ql(H,k,ue,we,Ce){H>>>=0,k>>>=0,ue>>>=0;var qe=En(ue);k=Kt(k),pn(H,{name:k,fromWireType:function(Ze){return!!Ze},toWireType:function(Ze,ve){return ve?we:Ce},argPackAdvance:8,readValueFromPointer:function(Ze){var ve;if(ue===1)ve=Be;else if(ue===2)ve=Je;else if(ue===4)ve=Le;else throw new TypeError("Unknown boolean type size: "+k);return this.fromWireType(ve[Ze>>>qe])},destructorFunction:null})}function Ms(H){if(!(this instanceof Ul)||!(H instanceof Ul))return!1;for(var k=this.$$.ptrType.registeredClass,ue=this.$$.ptr,we=H.$$.ptrType.registeredClass,Ce=H.$$.ptr;k.baseClass;)ue=k.upcast(ue),k=k.baseClass;for(;we.baseClass;)Ce=we.upcast(Ce),we=we.baseClass;return k===we&&ue===Ce}function us(H){return{count:H.count,deleteScheduled:H.deleteScheduled,preservePointerOnDelete:H.preservePointerOnDelete,ptr:H.ptr,ptrType:H.ptrType,smartPtr:H.smartPtr,smartPtrType:H.smartPtrType}}function bl(H){function k(ue){return ue.$$.ptrType.registeredClass.name}nn(k(H)+" instance already deleted")}var Es=!1;function Su(H){}function yd(H){H.smartPtr?H.smartPtrType.rawDestructor(H.smartPtr):H.ptrType.registeredClass.rawDestructor(H.ptr)}function O3(H){H.count.value-=1;var k=H.count.value===0;k&&yd(H)}function uc(H,k,ue){if(k===ue)return H;if(ue.baseClass===void 0)return null;var we=uc(H,k,ue.baseClass);return we===null?null:ue.downcast(we)}var L0={};function ai(){return Object.keys(It).length}function O0(){var H=[];for(var k in It)It.hasOwnProperty(k)&&H.push(It[k]);return H}var Wn=[];function g0(){for(;Wn.length;){var H=Wn.pop();H.$$.deleteScheduled=!1,H.delete()}}var wd=void 0;function x2(H){wd=H,Wn.length&&wd&&wd(g0)}function ke(){y.getInheritedInstanceCount=ai,y.getLiveInheritedInstances=O0,y.flushPendingDeletes=g0,y.setDelayFunction=x2}var It={};function At(H,k){for(k===void 0&&nn("ptr should not be undefined");H.baseClass;)k=H.upcast(k),H=H.baseClass;return k}function ye(H,k){return k=At(H,k),It[k]}function pt(H,k){(!k.ptrType||!k.ptr)&&Vn("makeClassHandle requires ptr and ptrType");var ue=!!k.smartPtrType,we=!!k.smartPtr;return ue!==we&&Vn("Both smartPtrType and smartPtr must be specified"),k.count={value:1},Nn(Object.create(H,{$$:{value:k}}))}function an(H){var k=this.getPointee(H);if(!k)return this.destructor(H),null;var ue=ye(this.registeredClass,k);if(ue!==void 0){if(ue.$$.count.value===0)return ue.$$.ptr=k,ue.$$.smartPtr=H,ue.clone();var we=ue.clone();return this.destructor(H),we}function Ce(){return this.isSmartPointer?pt(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:k,smartPtrType:this,smartPtr:H}):pt(this.registeredClass.instancePrototype,{ptrType:this,ptr:H})}var qe=this.registeredClass.getActualType(k),Ze=L0[qe];if(!Ze)return Ce.call(this);var ve;this.isConst?ve=Ze.constPointerType:ve=Ze.pointerType;var ot=uc(k,this.registeredClass,ve.registeredClass);return ot===null?Ce.call(this):this.isSmartPointer?pt(ve.registeredClass.instancePrototype,{ptrType:ve,ptr:ot,smartPtrType:this,smartPtr:H}):pt(ve.registeredClass.instancePrototype,{ptrType:ve,ptr:ot})}var Nn=function(H){return typeof FinalizationRegistry>"u"?(Nn=k=>k,H):(Es=new FinalizationRegistry(k=>{O3(k.$$)}),Nn=k=>{var ue=k.$$,we=!!ue.smartPtr;if(we){var Ce={$$:ue};Es.register(k,Ce,k)}return k},Su=k=>Es.unregister(k),Nn(H))};function Gn(){if(this.$$.ptr||bl(this),this.$$.preservePointerOnDelete)return this.$$.count.value+=1,this;var H=Nn(Object.create(Object.getPrototypeOf(this),{$$:{value:us(this.$$)}}));return H.$$.count.value+=1,H.$$.deleteScheduled=!1,H}function jn(){this.$$.ptr||bl(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&nn("Object already scheduled for deletion"),Su(this),O3(this.$$),this.$$.preservePointerOnDelete||(this.$$.smartPtr=void 0,this.$$.ptr=void 0)}function tl(){return!this.$$.ptr}function $t(){return this.$$.ptr||bl(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&nn("Object already scheduled for deletion"),Wn.push(this),Wn.length===1&&wd&&wd(g0),this.$$.deleteScheduled=!0,this}function Jn(){Ul.prototype.isAliasOf=Ms,Ul.prototype.clone=Gn,Ul.prototype.delete=jn,Ul.prototype.isDeleted=tl,Ul.prototype.deleteLater=$t}function Ul(){}var Iu=48,Ls=57;function Lu(H){if(H===void 0)return"_unknown";H=H.replace(/[^a-zA-Z0-9_]/g,"$");var k=H.charCodeAt(0);return k>=Iu&&k<=Ls?`_${H}`:H}function vl(H,k){return H=Lu(H),{[H]:function(){return k.apply(this,arguments)}}[H]}function rl(H,k,ue){if(H[k].overloadTable===void 0){var we=H[k];H[k]=function(){return H[k].overloadTable.hasOwnProperty(arguments.length)||nn(`Function '${ue}' called with an invalid number of arguments (${arguments.length}) - expects one of (${H[k].overloadTable})!`),H[k].overloadTable[arguments.length].apply(this,arguments)},H[k].overloadTable=[],H[k].overloadTable[we.argCount]=we}}function g3(H,k,ue){y.hasOwnProperty(H)?((ue===void 0||y[H].overloadTable!==void 0&&y[H].overloadTable[ue]!==void 0)&&nn(`Cannot register public name '${H}' twice`),rl(y,H,H),y.hasOwnProperty(ue)&&nn(`Cannot register multiple overloads of a function with the same number of arguments (${ue})!`),y[H].overloadTable[ue]=k):(y[H]=k,ue!==void 0&&(y[H].numArguments=ue))}function es(H,k,ue,we,Ce,qe,Ze,ve){this.name=H,this.constructor=k,this.instancePrototype=ue,this.rawDestructor=we,this.baseClass=Ce,this.getActualType=qe,this.upcast=Ze,this.downcast=ve,this.pureVirtualFunctions=[]}function Ou(H,k,ue){for(;k!==ue;)k.upcast||nn(`Expected null or instance of ${ue.name}, got an instance of ${k.name}`),H=k.upcast(H),k=k.baseClass;return H}function P3(H,k){if(k===null)return this.isReference&&nn(`null is not a valid ${this.name}`),0;k.$$||nn(`Cannot pass "${oc(k)}" as a ${this.name}`),k.$$.ptr||nn(`Cannot pass deleted object as a pointer of type ${this.name}`);var ue=k.$$.ptrType.registeredClass,we=Ou(k.$$.ptr,ue,this.registeredClass);return we}function Vc(H,k){var ue;if(k===null)return this.isReference&&nn(`null is not a valid ${this.name}`),this.isSmartPointer?(ue=this.rawConstructor(),H!==null&&H.push(this.rawDestructor,ue),ue):0;k.$$||nn(`Cannot pass "${oc(k)}" as a ${this.name}`),k.$$.ptr||nn(`Cannot pass deleted object as a pointer of type ${this.name}`),!this.isConst&&k.$$.ptrType.isConst&&nn(`Cannot convert argument of type ${k.$$.smartPtrType?k.$$.smartPtrType.name:k.$$.ptrType.name} to parameter type ${this.name}`);var we=k.$$.ptrType.registeredClass;if(ue=Ou(k.$$.ptr,we,this.registeredClass),this.isSmartPointer)switch(k.$$.smartPtr===void 0&&nn("Passing raw pointer to smart pointer is illegal"),this.sharingPolicy){case 0:k.$$.smartPtrType===this?ue=k.$$.smartPtr:nn(`Cannot convert argument of type ${k.$$.smartPtrType?k.$$.smartPtrType.name:k.$$.ptrType.name} to parameter type ${this.name}`);break;case 1:ue=k.$$.smartPtr;break;case 2:if(k.$$.smartPtrType===this)ue=k.$$.smartPtr;else{var Ce=k.clone();ue=this.rawShare(ue,Cl.toHandle(function(){Ce.delete()})),H!==null&&H.push(this.rawDestructor,ue)}break;default:nn("Unsupporting sharing policy")}return ue}function Ed(H,k){if(k===null)return this.isReference&&nn(`null is not a valid ${this.name}`),0;k.$$||nn(`Cannot pass "${oc(k)}" as a ${this.name}`),k.$$.ptr||nn(`Cannot pass deleted object as a pointer of type ${this.name}`),k.$$.ptrType.isConst&&nn(`Cannot convert argument of type ${k.$$.ptrType.name} to parameter type ${this.name}`);var ue=k.$$.ptrType.registeredClass,we=Ou(k.$$.ptr,ue,this.registeredClass);return we}function Os(H){return this.rawGetPointee&&(H=this.rawGetPointee(H)),H}function Zu(H){this.rawDestructor&&this.rawDestructor(H)}function ii(H){H!==null&&H.delete()}function xs(){Hs.prototype.getPointee=Os,Hs.prototype.destructor=Zu,Hs.prototype.argPackAdvance=8,Hs.prototype.readValueFromPointer=bn,Hs.prototype.deleteObject=ii,Hs.prototype.fromWireType=an}function Hs(H,k,ue,we,Ce,qe,Ze,ve,ot,Et,_t){this.name=H,this.registeredClass=k,this.isReference=ue,this.isConst=we,this.isSmartPointer=Ce,this.pointeeType=qe,this.sharingPolicy=Ze,this.rawGetPointee=ve,this.rawConstructor=ot,this.rawShare=Et,this.rawDestructor=_t,!Ce&&k.baseClass===void 0?we?(this.toWireType=P3,this.destructorFunction=null):(this.toWireType=Ed,this.destructorFunction=null):this.toWireType=Vc}function Wc(H,k,ue){y.hasOwnProperty(H)||Vn("Replacing nonexistant public symbol"),y[H].overloadTable!==void 0&&ue!==void 0?y[H].overloadTable[ue]=k:(y[H]=k,y[H].argCount=ue)}var Td=(H,k,ue)=>{var we=y["dynCall_"+H];return ue&&ue.length?we.apply(null,[k].concat(ue)):we.call(null,k)},jc=[],gu=H=>{var k=jc[H];return k||(H>=jc.length&&(jc.length=H+1),jc[H]=k=at.get(H)),k},pd=(H,k,ue)=>{if(H.includes("j"))return Td(H,k,ue);var we=gu(k).apply(null,ue);return we},ac=(H,k)=>{var ue=[];return function(){return ue.length=0,Object.assign(ue,arguments),pd(H,k,ue)}};function Bs(H,k){H=Kt(H);function ue(){return H.includes("j")?ac(H,k):gu(k)}var we=ue();return typeof we!="function"&&nn(`unknown function pointer with signature ${H}: ${k}`),we}function Rd(H,k){var ue=vl(k,function(we){this.name=k,this.message=we;var Ce=new Error(we).stack;Ce!==void 0&&(this.stack=this.toString()+`
`+Ce.replace(/^Error(:[^\n]*)?\n/,""))});return ue.prototype=Object.create(H.prototype),ue.prototype.constructor=ue,ue.prototype.toString=function(){return this.message===void 0?this.name:`${this.name}: ${this.message}`},ue}var ic=void 0;function tI(H){var k=TI(H),ue=Kt(k);return Mu(k),ue}function Ci(H,k){var ue=[],we={};function Ce(qe){if(!we[qe]&&!Gt[qe]){if(Rl[qe]){Rl[qe].forEach(Ce);return}ue.push(qe),we[qe]=!0}}throw k.forEach(Ce),new ic(`${H}: `+ue.map(tI).join([", "]))}function gs(H,k,ue,we,Ce,qe,Ze,ve,ot,Et,_t,ln,Qt){H>>>=0,k>>>=0,ue>>>=0,we>>>=0,Ce>>>=0,qe>>>=0,Ze>>>=0,ve>>>=0,ot>>>=0,Et>>>=0,_t>>>=0,ln>>>=0,Qt>>>=0,_t=Kt(_t),qe=Bs(Ce,qe),ve&&(ve=Bs(Ze,ve)),Et&&(Et=Bs(ot,Et)),Qt=Bs(ln,Qt);var kt=Lu(_t);g3(kt,function(){Ci(`Cannot construct ${_t} due to unbound types`,[we])}),gn([H,k,ue],we?[we]:[],function(Rn){Rn=Rn[0];var ul,ol;we?(ul=Rn.registeredClass,ol=ul.instancePrototype):ol=Ul.prototype;var El=vl(kt,function(){if(Object.getPrototypeOf(this)!==Mt)throw new tn("Use 'new' to construct "+_t);if(un.constructor_body===void 0)throw new tn(_t+" has no accessible constructor");var ts=un.constructor_body[arguments.length];if(ts===void 0)throw new tn(`Tried to invoke ctor of ${_t} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(un.constructor_body).toString()}) parameters instead!`);return ts.apply(this,arguments)}),Mt=Object.create(ol,{constructor:{value:El}});El.prototype=Mt;var un=new es(_t,El,Mt,Qt,ul,qe,ve,Et);un.baseClass&&(un.baseClass.__derivedClasses===void 0&&(un.baseClass.__derivedClasses=[]),un.baseClass.__derivedClasses.push(un));var Ts=new Hs(_t,un,!0,!1,!1),hl=new Hs(_t+"*",un,!1,!1,!1),Xs=new Hs(_t+" const*",un,!1,!0,!1);return L0[H]={pointerType:hl,constPointerType:Xs},Wc(kt,El),[Ts,hl,Xs]})}function Ju(H,k){for(var ue=[],we=0;we<H;we++)ue.push(Xe[k+we*4>>>2]);return ue}function cl(H,k){if(!(H instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof H} which is not a function`);var ue=vl(H.name||"unknownFunctionName",function(){});ue.prototype=H.prototype;var we=new ue,Ce=H.apply(we,k);return Ce instanceof Object?Ce:we}function Yc(H,k,ue,we,Ce,qe){var Ze=k.length;Ze<2&&nn("argTypes array size mismatch! Must at least get return value and 'this' types!");for(var ve=k[1]!==null&&ue!==null,ot=!1,Et=1;Et<k.length;++Et)if(k[Et]!==null&&k[Et].destructorFunction===void 0){ot=!0;break}for(var _t=k[0].name!=="void",ln="",Qt="",Et=0;Et<Ze-2;++Et)ln+=(Et!==0?", ":"")+"arg"+Et,Qt+=(Et!==0?", ":"")+"arg"+Et+"Wired";var kt=`
        return function ${Lu(H)}(${ln}) {
        if (arguments.length !== ${Ze-2}) {
          throwBindingError('function ${H} called with ${arguments.length} arguments, expected ${Ze-2} args!');
        }`;ot&&(kt+=`var destructors = [];
`);var Rn=ot?"destructors":"null",ul=["throwBindingError","invoker","fn","runDestructors","retType","classParam"],ol=[nn,we,Ce,In,k[0],k[1]];ve&&(kt+="var thisWired = classParam.toWireType("+Rn+`, this);
`);for(var Et=0;Et<Ze-2;++Et)kt+="var arg"+Et+"Wired = argType"+Et+".toWireType("+Rn+", arg"+Et+"); // "+k[Et+2].name+`
`,ul.push("argType"+Et),ol.push(k[Et+2]);if(ve&&(Qt="thisWired"+(Qt.length>0?", ":"")+Qt),kt+=(_t||qe?"var rv = ":"")+"invoker(fn"+(Qt.length>0?", ":"")+Qt+`);
`,ot)kt+=`runDestructors(destructors);
`;else for(var Et=ve?1:2;Et<k.length;++Et){var El=Et===1?"thisWired":"arg"+(Et-2)+"Wired";k[Et].destructorFunction!==null&&(kt+=El+"_dtor("+El+"); // "+k[Et].name+`
`,ul.push(El+"_dtor"),ol.push(k[Et].destructorFunction))}return _t&&(kt+=`var ret = retType.fromWireType(rv);
return ret;
`),kt+=`}
`,ul.push(kt),cl(Function,ul).apply(null,ol)}function Pu(H,k,ue,we,Ce,qe){H>>>=0,ue>>>=0,we>>>=0,Ce>>>=0,qe>>>=0;var Ze=Ju(k,ue);Ce=Bs(we,Ce),gn([],[H],function(ve){ve=ve[0];var ot=`constructor ${ve.name}`;if(ve.registeredClass.constructor_body===void 0&&(ve.registeredClass.constructor_body=[]),ve.registeredClass.constructor_body[k-1]!==void 0)throw new tn(`Cannot register multiple constructors with identical number of parameters (${k-1}) for class '${ve.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);return ve.registeredClass.constructor_body[k-1]=()=>{Ci(`Cannot construct ${ve.name} due to unbound types`,Ze)},gn([],Ze,function(Et){return Et.splice(1,0,null),ve.registeredClass.constructor_body[k-1]=Yc(ot,Et,null,Ce,qe),[]}),[]})}function md(H,k,ue,we,Ce,qe,Ze,ve,ot){H>>>=0,k>>>=0,we>>>=0,Ce>>>=0,qe>>>=0,Ze>>>=0;var Et=Ju(ue,we);k=Kt(k),qe=Bs(Ce,qe),gn([],[H],function(_t){_t=_t[0];var ln=`${_t.name}.${k}`;k.startsWith("@@")&&(k=Symbol[k.substring(2)]),ve&&_t.registeredClass.pureVirtualFunctions.push(k);function Qt(){Ci(`Cannot call ${ln} due to unbound types`,Et)}var kt=_t.registeredClass.instancePrototype,Rn=kt[k];return Rn===void 0||Rn.overloadTable===void 0&&Rn.className!==_t.name&&Rn.argCount===ue-2?(Qt.argCount=ue-2,Qt.className=_t.name,kt[k]=Qt):(rl(kt,k,ln),kt[k].overloadTable[ue-2]=Qt),gn([],Et,function(ul){var ol=Yc(ln,ul,_t,qe,Ze,ot);return kt[k].overloadTable===void 0?(ol.argCount=ue-2,kt[k]=ol):kt[k].overloadTable[ue-2]=ol,[]}),[]})}function Dd(){Object.assign(nI.prototype,{get(H){return this.allocated[H]},has(H){return this.allocated[H]!==void 0},allocate(H){var k=this.freelist.pop()||this.allocated.length;return this.allocated[k]=H,k},free(H){this.allocated[H]=void 0,this.freelist.push(H)}})}function nI(){this.allocated=[void 0],this.freelist=[]}var Vs=new nI;function Mi(H){H>>>=0,H>=Vs.reserved&&--Vs.get(H).refcount===0&&Vs.free(H)}function lI(){for(var H=0,k=Vs.reserved;k<Vs.allocated.length;++k)Vs.allocated[k]!==void 0&&++H;return H}function Nd(){Vs.allocated.push({value:void 0},{value:null},{value:!0},{value:!1}),Vs.reserved=Vs.allocated.length,y.count_emval_handles=lI}var Cl={toValue:H=>(H||nn("Cannot use deleted val. handle = "+H),Vs.get(H).value),toHandle:H=>{switch(H){case void 0:return 1;case null:return 2;case!0:return 3;case!1:return 4;default:return Vs.allocate({refcount:1,value:H})}}};function sI(H,k){H>>>=0,k>>>=0,k=Kt(k),pn(H,{name:k,fromWireType:function(ue){var we=Cl.toValue(ue);return Mi(ue),we},toWireType:function(ue,we){return Cl.toHandle(we)},argPackAdvance:8,readValueFromPointer:bn,destructorFunction:null})}function oc(H){if(H===null)return"null";var k=typeof H;return k==="object"||k==="array"||k==="function"?H.toString():""+H}function Ad(H,k){switch(k){case 2:return function(ue){return this.fromWireType(lt[ue>>>2])};case 3:return function(ue){return this.fromWireType(ht[ue>>>3])};default:throw new TypeError("Unknown float type: "+H)}}function Sd(H,k,ue){H>>>=0,k>>>=0,ue>>>=0;var we=En(ue);k=Kt(k),pn(H,{name:k,fromWireType:function(Ce){return Ce},toWireType:function(Ce,qe){return qe},argPackAdvance:8,readValueFromPointer:Ad(k,we),destructorFunction:null})}function xi(H,k,ue,we,Ce,qe,Ze){H>>>=0,ue>>>=0,we>>>=0,Ce>>>=0,qe>>>=0;var ve=Ju(k,ue);H=Kt(H),Ce=Bs(we,Ce),g3(H,function(){Ci(`Cannot call ${H} due to unbound types`,ve)},k-1),gn([],ve,function(ot){var Et=[ot[0],null].concat(ot.slice(1));return Wc(H,Yc(H,Et,null,Ce,qe,Ze),k-1),[]})}function zc(H,k,ue){switch(k){case 0:return ue?function(Ce){return Be[Ce>>>0]}:function(Ce){return Fe[Ce>>>0]};case 1:return ue?function(Ce){return Je[Ce>>>1]}:function(Ce){return ge[Ce>>>1]};case 2:return ue?function(Ce){return Le[Ce>>>2]}:function(Ce){return Xe[Ce>>>2]};default:throw new TypeError("Unknown integer type: "+H)}}function Hi(H,k,ue,we,Ce){H>>>=0,k>>>=0,ue>>>=0,k=Kt(k);var qe=En(ue),Ze=ln=>ln;if(we===0){var ve=32-8*ue;Ze=ln=>ln<<ve>>>ve}var ot=k.includes("unsigned"),Et=(ln,Qt)=>{},_t;ot?_t=function(ln,Qt){return Et(Qt,this.name),Qt>>>0}:_t=function(ln,Qt){return Et(Qt,this.name),Qt},pn(H,{name:k,fromWireType:Ze,toWireType:_t,argPackAdvance:8,readValueFromPointer:zc(k,qe,we!==0),destructorFunction:null})}function Ld(H,k,ue){H>>>=0,ue>>>=0;var we=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array],Ce=we[k];function qe(Ze){Ze=Ze>>2;var ve=Xe,ot=ve[Ze>>>0],Et=ve[Ze+1>>>0];return new Ce(ve.buffer,Et,ot)}ue=Kt(ue),pn(H,{name:ue,fromWireType:qe,argPackAdvance:8,readValueFromPointer:qe},{ignoreDuplicateRegistrations:!0})}var kc=(H,k,ue,we)=>{if(ue>>>=0,!(we>0))return 0;for(var Ce=ue,qe=ue+we-1,Ze=0;Ze<H.length;++Ze){var ve=H.charCodeAt(Ze);if(ve>=55296&&ve<=57343){var ot=H.charCodeAt(++Ze);ve=65536+((ve&1023)<<10)|ot&1023}if(ve<=127){if(ue>=qe)break;k[ue++>>>0]=ve}else if(ve<=2047){if(ue+1>=qe)break;k[ue++>>>0]=192|ve>>6,k[ue++>>>0]=128|ve&63}else if(ve<=65535){if(ue+2>=qe)break;k[ue++>>>0]=224|ve>>12,k[ue++>>>0]=128|ve>>6&63,k[ue++>>>0]=128|ve&63}else{if(ue+3>=qe)break;k[ue++>>>0]=240|ve>>18,k[ue++>>>0]=128|ve>>12&63,k[ue++>>>0]=128|ve>>6&63,k[ue++>>>0]=128|ve&63}}return k[ue>>>0]=0,ue-Ce},oi=(H,k,ue)=>kc(H,Fe,k,ue),cc=H=>{for(var k=0,ue=0;ue<H.length;++ue){var we=H.charCodeAt(ue);we<=127?k++:we<=2047?k+=2:we>=55296&&we<=57343?(k+=4,++ue):k+=3}return k},rI=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0,bu=(H,k,ue)=>{k>>>=0;for(var we=k+ue,Ce=k;H[Ce]&&!(Ce>=we);)++Ce;if(Ce-k>16&&H.buffer&&rI)return rI.decode(H.subarray(k,Ce));for(var qe="";k<Ce;){var Ze=H[k++];if(!(Ze&128)){qe+=String.fromCharCode(Ze);continue}var ve=H[k++]&63;if((Ze&224)==192){qe+=String.fromCharCode((Ze&31)<<6|ve);continue}var ot=H[k++]&63;if((Ze&240)==224?Ze=(Ze&15)<<12|ve<<6|ot:Ze=(Ze&7)<<18|ve<<12|ot<<6|H[k++]&63,Ze<65536)qe+=String.fromCharCode(Ze);else{var Et=Ze-65536;qe+=String.fromCharCode(55296|Et>>10,56320|Et&1023)}}return qe},hc=(H,k)=>(H>>>=0,H?bu(Fe,H,k):"");function Bi(H,k){H>>>=0,k>>>=0,k=Kt(k);var ue=k==="std::string";pn(H,{name:k,fromWireType:function(we){var Ce=Xe[we>>>2],qe=we+4,Ze;if(ue)for(var ve=qe,ot=0;ot<=Ce;++ot){var Et=qe+ot;if(ot==Ce||Fe[Et>>>0]==0){var _t=Et-ve,ln=hc(ve,_t);Ze===void 0?Ze=ln:(Ze+="\0",Ze+=ln),ve=Et+1}}else{for(var Qt=new Array(Ce),ot=0;ot<Ce;++ot)Qt[ot]=String.fromCharCode(Fe[qe+ot>>>0]);Ze=Qt.join("")}return Mu(we),Ze},toWireType:function(we,Ce){Ce instanceof ArrayBuffer&&(Ce=new Uint8Array(Ce));var qe,Ze=typeof Ce=="string";Ze||Ce instanceof Uint8Array||Ce instanceof Uint8ClampedArray||Ce instanceof Int8Array||nn("Cannot pass non-string to std::string"),ue&&Ze?qe=cc(Ce):qe=Ce.length;var ve=Tc(4+qe+1),ot=ve+4;if(Xe[ve>>>2]=qe,ue&&Ze)oi(Ce,ot,qe+1);else if(Ze)for(var Et=0;Et<qe;++Et){var _t=Ce.charCodeAt(Et);_t>255&&(Mu(ot),nn("String has UTF-16 code units that do not fit in 8 bits")),Fe[ot+Et>>>0]=_t}else for(var Et=0;Et<qe;++Et)Fe[ot+Et>>>0]=Ce[Et];return we!==null&&we.push(Mu,ve),ve},argPackAdvance:8,readValueFromPointer:bn,destructorFunction:function(we){Mu(we)}})}var uI=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,Od=(H,k)=>{for(var ue=H,we=ue>>1,Ce=we+k/2;!(we>=Ce)&&ge[we>>>0];)++we;if(ue=we<<1,ue-H>32&&uI)return uI.decode(Fe.subarray(H>>>0,ue>>>0));for(var qe="",Ze=0;!(Ze>=k/2);++Ze){var ve=Je[H+Ze*2>>>1];if(ve==0)break;qe+=String.fromCharCode(ve)}return qe},gd=(H,k,ue)=>{if(ue===void 0&&(ue=2147483647),ue<2)return 0;ue-=2;for(var we=k,Ce=ue<H.length*2?ue/2:H.length,qe=0;qe<Ce;++qe){var Ze=H.charCodeAt(qe);Je[k>>>1]=Ze,k+=2}return Je[k>>>1]=0,k-we},Pd=H=>H.length*2,bd=(H,k)=>{for(var ue=0,we="";!(ue>=k/4);){var Ce=Le[H+ue*4>>>2];if(Ce==0)break;if(++ue,Ce>=65536){var qe=Ce-65536;we+=String.fromCharCode(55296|qe>>10,56320|qe&1023)}else we+=String.fromCharCode(Ce)}return we},Xu=(H,k,ue)=>{if(k>>>=0,ue===void 0&&(ue=2147483647),ue<4)return 0;for(var we=k,Ce=we+ue-4,qe=0;qe<H.length;++qe){var Ze=H.charCodeAt(qe);if(Ze>=55296&&Ze<=57343){var ve=H.charCodeAt(++qe);Ze=65536+((Ze&1023)<<10)|ve&1023}if(Le[k>>>2]=Ze,k+=4,k+4>Ce)break}return Le[k>>>2]=0,k-we},Cd=H=>{for(var k=0,ue=0;ue<H.length;++ue){var we=H.charCodeAt(ue);we>=55296&&we<=57343&&++ue,k+=4}return k},Md=function(H,k,ue){H>>>=0,k>>>=0,ue>>>=0,ue=Kt(ue);var we,Ce,qe,Ze,ve;k===2?(we=Od,Ce=gd,Ze=Pd,qe=()=>ge,ve=1):k===4&&(we=bd,Ce=Xu,Ze=Cd,qe=()=>Xe,ve=2),pn(H,{name:ue,fromWireType:function(ot){for(var Et=Xe[ot>>>2],_t=qe(),ln,Qt=ot+4,kt=0;kt<=Et;++kt){var Rn=ot+4+kt*k;if(kt==Et||_t[Rn>>>ve]==0){var ul=Rn-Qt,ol=we(Qt,ul);ln===void 0?ln=ol:(ln+="\0",ln+=ol),Qt=Rn+k}}return Mu(ot),ln},toWireType:function(ot,Et){typeof Et!="string"&&nn(`Cannot pass non-string to C++ string type ${ue}`);var _t=Ze(Et),ln=Tc(4+_t+k);return Xe[ln>>>2]=_t>>ve,Ce(Et,ln+4,_t+k),ot!==null&&ot.push(Mu,ln),ln},argPackAdvance:8,readValueFromPointer:bn,destructorFunction:function(ot){Mu(ot)}})};function qc(H,k,ue,we,Ce,qe){H>>>=0,k>>>=0,ue>>>=0,we>>>=0,Ce>>>=0,qe>>>=0,on[H]={name:Kt(k),rawConstructor:Bs(ue,we),rawDestructor:Bs(Ce,qe),elements:[]}}function Kc(H,k,ue,we,Ce,qe,Ze,ve,ot){H>>>=0,k>>>=0,ue>>>=0,we>>>=0,Ce>>>=0,qe>>>=0,Ze>>>=0,ve>>>=0,ot>>>=0,on[H].elements.push({getterReturnType:k,getter:Bs(ue,we),getterContext:Ce,setterArgumentType:qe,setter:Bs(Ze,ve),setterContext:ot})}function aI(H,k,ue,we,Ce,qe){H>>>=0,k>>>=0,ue>>>=0,we>>>=0,Ce>>>=0,qe>>>=0,Zn[H]={name:Kt(k),rawConstructor:Bs(ue,we),rawDestructor:Bs(Ce,qe),fields:[]}}function iI(H,k,ue,we,Ce,qe,Ze,ve,ot,Et){H>>>=0,k>>>=0,ue>>>=0,we>>>=0,Ce>>>=0,qe>>>=0,Ze>>>=0,ve>>>=0,ot>>>=0,Et>>>=0,Zn[H].fields.push({fieldName:Kt(k),getterReturnType:ue,getter:Bs(we,Ce),getterContext:qe,setterArgumentType:Ze,setter:Bs(ve,ot),setterContext:Et})}function xd(H,k){H>>>=0,k>>>=0,k=Kt(k),pn(H,{isVoid:!0,name:k,argPackAdvance:0,fromWireType:function(){},toWireType:function(ue,we){}})}var Qc=!0,Hd=()=>Qc;function $c(H,k){var ue=Gt[H];return ue===void 0&&nn(k+" has unknown type "+tI(H)),ue}function Bd(H,k,ue){H>>>=0,k>>>=0,ue>>>=0,H=Cl.toValue(H),k=$c(k,"emval::as");var we=[],Ce=Cl.toHandle(we);return Xe[ue>>>2]=Ce,k.toWireType(we,H)}function Ud(H,k){for(var ue=new Array(H),we=0;we<H;++we)ue[we]=$c(Xe[k+we*4>>>2],"parameter "+we);return ue}function Fd(H,k,ue,we){H>>>=0,ue>>>=0,we>>>=0,H=Cl.toValue(H);for(var Ce=Ud(k,ue),qe=new Array(k),Ze=0;Ze<k;++Ze){var ve=Ce[Ze];qe[Ze]=ve.readValueFromPointer(we),we+=ve.argPackAdvance}var ot=H.apply(void 0,qe);return Cl.toHandle(ot)}var Gd={};function oI(H){var k=Gd[H];return k===void 0?Kt(H):k}function du(){return typeof globalThis=="object"?globalThis:function(){return Function}()("return this")()}function cI(H){return H>>>=0,H===0?Cl.toHandle(du()):(H=oI(H),Cl.toHandle(du()[H]))}function _d(H,k){return H>>>=0,k>>>=0,H=Cl.toValue(H),k=Cl.toValue(k),Cl.toHandle(H[k])}function Vd(H){H>>>=0,H>4&&(Vs.get(H).refcount+=1)}function Wd(H,k){return H>>>=0,k>>>=0,H=Cl.toValue(H),k=Cl.toValue(k),H instanceof k}function Us(H){return H>>>=0,H=Cl.toValue(H),typeof H=="number"}function jd(H){return H>>>=0,H=Cl.toValue(H),typeof H=="string"}function hI(){return Cl.toHandle([])}function fI(H){return H>>>=0,Cl.toHandle(oI(H))}function fc(){return Cl.toHandle({})}function Yd(H){H>>>=0;var k=Cl.toValue(H);In(k),Mi(H)}function Zc(H,k,ue){H>>>=0,k>>>=0,ue>>>=0,H=Cl.toValue(H),k=Cl.toValue(k),ue=Cl.toValue(ue),H[k]=ue}function zd(H,k){H>>>=0,k>>>=0,H=$c(H,"_emval_take_value");var ue=H.readValueFromPointer(k);return Cl.toHandle(ue)}function Jc(H,k,ue){var we=Wt(H,k);ue>>>=0;var Ce=new Date(we*1e3);Le[ue>>>2]=Ce.getUTCSeconds(),Le[ue+4>>>2]=Ce.getUTCMinutes(),Le[ue+8>>>2]=Ce.getUTCHours(),Le[ue+12>>>2]=Ce.getUTCDate(),Le[ue+16>>>2]=Ce.getUTCMonth(),Le[ue+20>>>2]=Ce.getUTCFullYear()-1900,Le[ue+24>>>2]=Ce.getUTCDay();var qe=Date.UTC(Ce.getUTCFullYear(),0,1,0,0,0,0),Ze=(Ce.getTime()-qe)/(1e3*60*60*24)|0;Le[ue+28>>>2]=Ze}var Ui=H=>H%4===0&&(H%100!==0||H%400===0),kd=[0,31,60,91,121,152,182,213,244,274,305,335],qd=[0,31,59,90,120,151,181,212,243,273,304,334],II=H=>{var k=Ui(H.getFullYear()),ue=k?kd:qd,we=ue[H.getMonth()]+H.getDate()-1;return we};function Js(H,k,ue){var we=Wt(H,k);ue>>>=0;var Ce=new Date(we*1e3);Le[ue>>>2]=Ce.getSeconds(),Le[ue+4>>>2]=Ce.getMinutes(),Le[ue+8>>>2]=Ce.getHours(),Le[ue+12>>>2]=Ce.getDate(),Le[ue+16>>>2]=Ce.getMonth(),Le[ue+20>>>2]=Ce.getFullYear()-1900,Le[ue+24>>>2]=Ce.getDay();var qe=II(Ce)|0;Le[ue+28>>>2]=qe,Le[ue+36>>>2]=-(Ce.getTimezoneOffset()*60);var Ze=new Date(Ce.getFullYear(),0,1),ve=new Date(Ce.getFullYear(),6,1).getTimezoneOffset(),ot=Ze.getTimezoneOffset(),Et=(ve!=ot&&Ce.getTimezoneOffset()==Math.min(ot,ve))|0;Le[ue+32>>>2]=Et}var Ic=H=>{var k=cc(H)+1,ue=Tc(k);return ue&&oi(H,ue,k),ue};function Kd(H,k,ue){H>>>=0,k>>>=0,ue>>>=0;var we=new Date().getFullYear(),Ce=new Date(we,0,1),qe=new Date(we,6,1),Ze=Ce.getTimezoneOffset(),ve=qe.getTimezoneOffset(),ot=Math.max(Ze,ve);Xe[H>>>2]=ot*60,Le[k>>>2]=+(Ze!=ve);function Et(Rn){var ul=Rn.toTimeString().match(/\(([A-Za-z ]+)\)$/);return ul?ul[1]:"GMT"}var _t=Et(Ce),ln=Et(qe),Qt=Ic(_t),kt=Ic(ln);ve<Ze?(Xe[ue>>>2]=Qt,Xe[ue+4>>>2]=kt):(Xe[ue>>>2]=kt,Xe[ue+4>>>2]=Qt)}var Qd=()=>{yn("")};function Fl(){return Date.now()}function $d(H,k,ue){return H>>>=0,k>>>=0,ue>>>=0,Fe.copyWithin(H>>>0,k>>>0,k+ue>>>0)}var Xc=()=>4294901760,Zd=H=>{var k=Re.buffer,ue=H-k.byteLength+65535>>>16;try{return Re.grow(ue),et(),1}catch{}};function Jd(H){H>>>=0;var k=Fe.length,ue=Xc();if(H>ue)return!1;for(var we=(ot,Et)=>ot+(Et-ot%Et)%Et,Ce=1;Ce<=4;Ce*=2){var qe=k*(1+.2/Ce);qe=Math.min(qe,H+100663296);var Ze=Math.min(ue,we(Math.max(H,qe),65536)),ve=Zd(Ze);if(ve)return!0}return!1}var vc={},Xd=()=>_||"./this.program",Fi=()=>{if(!Fi.strings){var H=(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",k={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:H,_:Xd()};for(var ue in vc)vc[ue]===void 0?delete k[ue]:k[ue]=vc[ue];var we=[];for(var ue in k)we.push(`${ue}=${k[ue]}`);Fi.strings=we}return Fi.strings},vd=(H,k)=>{for(var ue=0;ue<H.length;++ue)Be[k++>>>0]=H.charCodeAt(ue);Be[k>>>0]=0},wl={isAbs:H=>H.charAt(0)==="/",splitPath:H=>{var k=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return k.exec(H).slice(1)},normalizeArray:(H,k)=>{for(var ue=0,we=H.length-1;we>=0;we--){var Ce=H[we];Ce==="."?H.splice(we,1):Ce===".."?(H.splice(we,1),ue++):ue&&(H.splice(we,1),ue--)}if(k)for(;ue;ue--)H.unshift("..");return H},normalize:H=>{var k=wl.isAbs(H),ue=H.substr(-1)==="/";return H=wl.normalizeArray(H.split("/").filter(we=>!!we),!k).join("/"),!H&&!k&&(H="."),H&&ue&&(H+="/"),(k?"/":"")+H},dirname:H=>{var k=wl.splitPath(H),ue=k[0],we=k[1];return!ue&&!we?".":(we&&(we=we.substr(0,we.length-1)),ue+we)},basename:H=>{if(H==="/")return"/";H=wl.normalize(H),H=H.replace(/\/$/,"");var k=H.lastIndexOf("/");return k===-1?H:H.substr(k+1)},join:function(){var H=Array.prototype.slice.call(arguments);return wl.normalize(H.join("/"))},join2:(H,k)=>wl.normalize(H+"/"+k)},e1=()=>{if(typeof crypto=="object"&&typeof crypto.getRandomValues=="function")return H=>crypto.getRandomValues(H);yn("initRandomDevice")},eh=H=>(eh=e1())(H),Cu={resolve:function(){for(var H="",k=!1,ue=arguments.length-1;ue>=-1&&!k;ue--){var we=ue>=0?arguments[ue]:Me.cwd();if(typeof we!="string")throw new TypeError("Arguments to path.resolve must be strings");if(!we)return"";H=we+"/"+H,k=wl.isAbs(we)}return H=wl.normalizeArray(H.split("/").filter(Ce=>!!Ce),!k).join("/"),(k?"/":"")+H||"."},relative:(H,k)=>{H=Cu.resolve(H).substr(1),k=Cu.resolve(k).substr(1);function ue(Et){for(var _t=0;_t<Et.length&&Et[_t]==="";_t++);for(var ln=Et.length-1;ln>=0&&Et[ln]==="";ln--);return _t>ln?[]:Et.slice(_t,ln-_t+1)}for(var we=ue(H.split("/")),Ce=ue(k.split("/")),qe=Math.min(we.length,Ce.length),Ze=qe,ve=0;ve<qe;ve++)if(we[ve]!==Ce[ve]){Ze=ve;break}for(var ot=[],ve=Ze;ve<we.length;ve++)ot.push("..");return ot=ot.concat(Ce.slice(Ze)),ot.join("/")}},th=[];function dc(H,k,ue){var we=cc(H)+1,Ce=new Array(we),qe=kc(H,Ce,0,Ce.length);return k&&(Ce.length=qe),Ce}var t1=()=>{if(!th.length){var H=null;if(typeof window<"u"&&typeof window.prompt=="function"?(H=window.prompt("Input: "),H!==null&&(H+=`
`)):typeof readline=="function"&&(H=readline(),H!==null&&(H+=`
`)),!H)return null;th=dc(H,!0)}return th.shift()},qa={ttys:[],init:function(){},shutdown:function(){},register:function(H,k){qa.ttys[H]={input:[],output:[],ops:k},Me.registerDevice(H,qa.stream_ops)},stream_ops:{open:function(H){var k=qa.ttys[H.node.rdev];if(!k)throw new Me.ErrnoError(43);H.tty=k,H.seekable=!1},close:function(H){H.tty.ops.fsync(H.tty)},fsync:function(H){H.tty.ops.fsync(H.tty)},read:function(H,k,ue,we,Ce){if(!H.tty||!H.tty.ops.get_char)throw new Me.ErrnoError(60);for(var qe=0,Ze=0;Ze<we;Ze++){var ve;try{ve=H.tty.ops.get_char(H.tty)}catch{throw new Me.ErrnoError(29)}if(ve===void 0&&qe===0)throw new Me.ErrnoError(6);if(ve==null)break;qe++,k[ue+Ze]=ve}return qe&&(H.node.timestamp=Date.now()),qe},write:function(H,k,ue,we,Ce){if(!H.tty||!H.tty.ops.put_char)throw new Me.ErrnoError(60);try{for(var qe=0;qe<we;qe++)H.tty.ops.put_char(H.tty,k[ue+qe])}catch{throw new Me.ErrnoError(29)}return we&&(H.node.timestamp=Date.now()),qe}},default_tty_ops:{get_char:function(H){return t1()},put_char:function(H,k){k===null||k===10?(de(bu(H.output,0)),H.output=[]):k!=0&&H.output.push(k)},fsync:function(H){H.output&&H.output.length>0&&(de(bu(H.output,0)),H.output=[])},ioctl_tcgets:function(H){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets:function(H,k,ue){return 0},ioctl_tiocgwinsz:function(H){return[24,80]}},default_tty1_ops:{put_char:function(H,k){k===null||k===10?(oe(bu(H.output,0)),H.output=[]):k!=0&&H.output.push(k)},fsync:function(H){H.output&&H.output.length>0&&(oe(bu(H.output,0)),H.output=[])}}},dI=H=>{yn()},kn={ops_table:null,mount(H){return kn.createNode(null,"/",16895,0)},createNode(H,k,ue,we){if(Me.isBlkdev(ue)||Me.isFIFO(ue))throw new Me.ErrnoError(63);kn.ops_table||(kn.ops_table={dir:{node:{getattr:kn.node_ops.getattr,setattr:kn.node_ops.setattr,lookup:kn.node_ops.lookup,mknod:kn.node_ops.mknod,rename:kn.node_ops.rename,unlink:kn.node_ops.unlink,rmdir:kn.node_ops.rmdir,readdir:kn.node_ops.readdir,symlink:kn.node_ops.symlink},stream:{llseek:kn.stream_ops.llseek}},file:{node:{getattr:kn.node_ops.getattr,setattr:kn.node_ops.setattr},stream:{llseek:kn.stream_ops.llseek,read:kn.stream_ops.read,write:kn.stream_ops.write,allocate:kn.stream_ops.allocate,mmap:kn.stream_ops.mmap,msync:kn.stream_ops.msync}},link:{node:{getattr:kn.node_ops.getattr,setattr:kn.node_ops.setattr,readlink:kn.node_ops.readlink},stream:{}},chrdev:{node:{getattr:kn.node_ops.getattr,setattr:kn.node_ops.setattr},stream:Me.chrdev_stream_ops}});var Ce=Me.createNode(H,k,ue,we);return Me.isDir(Ce.mode)?(Ce.node_ops=kn.ops_table.dir.node,Ce.stream_ops=kn.ops_table.dir.stream,Ce.contents={}):Me.isFile(Ce.mode)?(Ce.node_ops=kn.ops_table.file.node,Ce.stream_ops=kn.ops_table.file.stream,Ce.usedBytes=0,Ce.contents=null):Me.isLink(Ce.mode)?(Ce.node_ops=kn.ops_table.link.node,Ce.stream_ops=kn.ops_table.link.stream):Me.isChrdev(Ce.mode)&&(Ce.node_ops=kn.ops_table.chrdev.node,Ce.stream_ops=kn.ops_table.chrdev.stream),Ce.timestamp=Date.now(),H&&(H.contents[k]=Ce,H.timestamp=Ce.timestamp),Ce},getFileDataAsTypedArray(H){return H.contents?H.contents.subarray?H.contents.subarray(0,H.usedBytes):new Uint8Array(H.contents):new Uint8Array(0)},expandFileStorage(H,k){var ue=H.contents?H.contents.length:0;if(!(ue>=k)){var we=1024*1024;k=Math.max(k,ue*(ue<we?2:1.125)>>>0),ue!=0&&(k=Math.max(k,256));var Ce=H.contents;H.contents=new Uint8Array(k),H.usedBytes>0&&H.contents.set(Ce.subarray(0,H.usedBytes),0)}},resizeFileStorage(H,k){if(H.usedBytes!=k)if(k==0)H.contents=null,H.usedBytes=0;else{var ue=H.contents;H.contents=new Uint8Array(k),ue&&H.contents.set(ue.subarray(0,Math.min(k,H.usedBytes))),H.usedBytes=k}},node_ops:{getattr(H){var k={};return k.dev=Me.isChrdev(H.mode)?H.id:1,k.ino=H.id,k.mode=H.mode,k.nlink=1,k.uid=0,k.gid=0,k.rdev=H.rdev,Me.isDir(H.mode)?k.size=4096:Me.isFile(H.mode)?k.size=H.usedBytes:Me.isLink(H.mode)?k.size=H.link.length:k.size=0,k.atime=new Date(H.timestamp),k.mtime=new Date(H.timestamp),k.ctime=new Date(H.timestamp),k.blksize=4096,k.blocks=Math.ceil(k.size/k.blksize),k},setattr(H,k){k.mode!==void 0&&(H.mode=k.mode),k.timestamp!==void 0&&(H.timestamp=k.timestamp),k.size!==void 0&&kn.resizeFileStorage(H,k.size)},lookup(H,k){throw Me.genericErrors[44]},mknod(H,k,ue,we){return kn.createNode(H,k,ue,we)},rename(H,k,ue){if(Me.isDir(H.mode)){var we;try{we=Me.lookupNode(k,ue)}catch{}if(we)for(var Ce in we.contents)throw new Me.ErrnoError(55)}delete H.parent.contents[H.name],H.parent.timestamp=Date.now(),H.name=ue,k.contents[ue]=H,k.timestamp=H.parent.timestamp,H.parent=k},unlink(H,k){delete H.contents[k],H.timestamp=Date.now()},rmdir(H,k){var ue=Me.lookupNode(H,k);for(var we in ue.contents)throw new Me.ErrnoError(55);delete H.contents[k],H.timestamp=Date.now()},readdir(H){var k=[".",".."];for(var ue in H.contents)H.contents.hasOwnProperty(ue)&&k.push(ue);return k},symlink(H,k,ue){var we=kn.createNode(H,k,41471,0);return we.link=ue,we},readlink(H){if(!Me.isLink(H.mode))throw new Me.ErrnoError(28);return H.link}},stream_ops:{read(H,k,ue,we,Ce){var qe=H.node.contents;if(Ce>=H.node.usedBytes)return 0;var Ze=Math.min(H.node.usedBytes-Ce,we);if(Ze>8&&qe.subarray)k.set(qe.subarray(Ce,Ce+Ze),ue);else for(var ve=0;ve<Ze;ve++)k[ue+ve]=qe[Ce+ve];return Ze},write(H,k,ue,we,Ce,qe){if(k.buffer===Be.buffer&&(qe=!1),!we)return 0;var Ze=H.node;if(Ze.timestamp=Date.now(),k.subarray&&(!Ze.contents||Ze.contents.subarray)){if(qe)return Ze.contents=k.subarray(ue,ue+we),Ze.usedBytes=we,we;if(Ze.usedBytes===0&&Ce===0)return Ze.contents=k.slice(ue,ue+we),Ze.usedBytes=we,we;if(Ce+we<=Ze.usedBytes)return Ze.contents.set(k.subarray(ue,ue+we),Ce),we}if(kn.expandFileStorage(Ze,Ce+we),Ze.contents.subarray&&k.subarray)Ze.contents.set(k.subarray(ue,ue+we),Ce);else for(var ve=0;ve<we;ve++)Ze.contents[Ce+ve]=k[ue+ve];return Ze.usedBytes=Math.max(Ze.usedBytes,Ce+we),we},llseek(H,k,ue){var we=k;if(ue===1?we+=H.position:ue===2&&Me.isFile(H.node.mode)&&(we+=H.node.usedBytes),we<0)throw new Me.ErrnoError(28);return we},allocate(H,k,ue){kn.expandFileStorage(H.node,k+ue),H.node.usedBytes=Math.max(H.node.usedBytes,k+ue)},mmap(H,k,ue,we,Ce){if(!Me.isFile(H.node.mode))throw new Me.ErrnoError(43);var qe,Ze,ve=H.node.contents;if(!(Ce&2)&&ve.buffer===Be.buffer)Ze=!1,qe=ve.byteOffset;else{if((ue>0||ue+k<ve.length)&&(ve.subarray?ve=ve.subarray(ue,ue+k):ve=Array.prototype.slice.call(ve,ue,ue+k)),Ze=!0,qe=dI(),!qe)throw new Me.ErrnoError(48);Be.set(ve,qe>>>0)}return{ptr:qe,allocated:Ze}},msync(H,k,ue,we,Ce){return kn.stream_ops.write(H,k,0,we,ue,!1),0}}},n1=(H,k,ue,we)=>{var Ce=`al ${H}`;he(H,qe=>{je(qe,`Loading data file "${H}" failed (no arrayBuffer).`),k(new Uint8Array(qe)),Ce&&Fn()},qe=>{if(ue)ue();else throw`Loading data file "${H}" failed.`}),Ce&&Un()},l1=y.preloadPlugins||[];function s1(H,k,ue,we){typeof Browser<"u"&&Browser.init();var Ce=!1;return l1.forEach(function(qe){Ce||qe.canHandle(k)&&(qe.handle(H,k,ue,we),Ce=!0)}),Ce}function r1(H,k,ue,we,Ce,qe,Ze,ve,ot,Et){var _t=k?Cu.resolve(wl.join2(H,k)):H;function ln(Qt){function kt(Rn){Et&&Et(),ve||Me.createDataFile(H,k,Rn,we,Ce,ot),qe&&qe(),Fn()}s1(Qt,_t,kt,()=>{Ze&&Ze(),Fn()})||kt(Qt)}Un(),typeof ue=="string"?n1(ue,Qt=>ln(Qt),Ze):ln(ue)}function u1(H){var k={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},ue=k[H];if(typeof ue>"u")throw new Error(`Unknown file open mode: ${H}`);return ue}function nh(H,k){var ue=0;return H&&(ue|=365),k&&(ue|=146),ue}var Me={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:(H,k={})=>{if(H=Cu.resolve(H),!H)return{path:"",node:null};var ue={follow_mount:!0,recurse_count:0};if(k=Object.assign(ue,k),k.recurse_count>8)throw new Me.ErrnoError(32);for(var we=H.split("/").filter(ln=>!!ln),Ce=Me.root,qe="/",Ze=0;Ze<we.length;Ze++){var ve=Ze===we.length-1;if(ve&&k.parent)break;if(Ce=Me.lookupNode(Ce,we[Ze]),qe=wl.join2(qe,we[Ze]),Me.isMountpoint(Ce)&&(!ve||ve&&k.follow_mount)&&(Ce=Ce.mounted.root),!ve||k.follow)for(var ot=0;Me.isLink(Ce.mode);){var Et=Me.readlink(qe);qe=Cu.resolve(wl.dirname(qe),Et);var _t=Me.lookupPath(qe,{recurse_count:k.recurse_count+1});if(Ce=_t.node,ot++>40)throw new Me.ErrnoError(32)}}return{path:qe,node:Ce}},getPath:H=>{for(var k;;){if(Me.isRoot(H)){var ue=H.mount.mountpoint;return k?ue[ue.length-1]!=="/"?`${ue}/${k}`:ue+k:ue}k=k?`${H.name}/${k}`:H.name,H=H.parent}},hashName:(H,k)=>{for(var ue=0,we=0;we<k.length;we++)ue=(ue<<5)-ue+k.charCodeAt(we)|0;return(H+ue>>>0)%Me.nameTable.length},hashAddNode:H=>{var k=Me.hashName(H.parent.id,H.name);H.name_next=Me.nameTable[k],Me.nameTable[k]=H},hashRemoveNode:H=>{var k=Me.hashName(H.parent.id,H.name);if(Me.nameTable[k]===H)Me.nameTable[k]=H.name_next;else for(var ue=Me.nameTable[k];ue;){if(ue.name_next===H){ue.name_next=H.name_next;break}ue=ue.name_next}},lookupNode:(H,k)=>{var ue=Me.mayLookup(H);if(ue)throw new Me.ErrnoError(ue,H);for(var we=Me.hashName(H.id,k),Ce=Me.nameTable[we];Ce;Ce=Ce.name_next){var qe=Ce.name;if(Ce.parent.id===H.id&&qe===k)return Ce}return Me.lookup(H,k)},createNode:(H,k,ue,we)=>{var Ce=new Me.FSNode(H,k,ue,we);return Me.hashAddNode(Ce),Ce},destroyNode:H=>{Me.hashRemoveNode(H)},isRoot:H=>H===H.parent,isMountpoint:H=>!!H.mounted,isFile:H=>(H&61440)===32768,isDir:H=>(H&61440)===16384,isLink:H=>(H&61440)===40960,isChrdev:H=>(H&61440)===8192,isBlkdev:H=>(H&61440)===24576,isFIFO:H=>(H&61440)===4096,isSocket:H=>(H&49152)===49152,flagsToPermissionString:H=>{var k=["r","w","rw"][H&3];return H&512&&(k+="w"),k},nodePermissions:(H,k)=>Me.ignorePermissions?0:k.includes("r")&&!(H.mode&292)||k.includes("w")&&!(H.mode&146)||k.includes("x")&&!(H.mode&73)?2:0,mayLookup:H=>{var k=Me.nodePermissions(H,"x");return k||(H.node_ops.lookup?0:2)},mayCreate:(H,k)=>{try{var ue=Me.lookupNode(H,k);return 20}catch{}return Me.nodePermissions(H,"wx")},mayDelete:(H,k,ue)=>{var we;try{we=Me.lookupNode(H,k)}catch(qe){return qe.errno}var Ce=Me.nodePermissions(H,"wx");if(Ce)return Ce;if(ue){if(!Me.isDir(we.mode))return 54;if(Me.isRoot(we)||Me.getPath(we)===Me.cwd())return 10}else if(Me.isDir(we.mode))return 31;return 0},mayOpen:(H,k)=>H?Me.isLink(H.mode)?32:Me.isDir(H.mode)&&(Me.flagsToPermissionString(k)!=="r"||k&512)?31:Me.nodePermissions(H,Me.flagsToPermissionString(k)):44,MAX_OPEN_FDS:4096,nextfd:()=>{for(var H=0;H<=Me.MAX_OPEN_FDS;H++)if(!Me.streams[H])return H;throw new Me.ErrnoError(33)},getStreamChecked:H=>{var k=Me.getStream(H);if(!k)throw new Me.ErrnoError(8);return k},getStream:H=>Me.streams[H],createStream:(H,k=-1)=>(Me.FSStream||(Me.FSStream=function(){this.shared={}},Me.FSStream.prototype={},Object.defineProperties(Me.FSStream.prototype,{object:{get(){return this.node},set(ue){this.node=ue}},isRead:{get(){return(this.flags&2097155)!==1}},isWrite:{get(){return(this.flags&2097155)!==0}},isAppend:{get(){return this.flags&1024}},flags:{get(){return this.shared.flags},set(ue){this.shared.flags=ue}},position:{get(){return this.shared.position},set(ue){this.shared.position=ue}}})),H=Object.assign(new Me.FSStream,H),k==-1&&(k=Me.nextfd()),H.fd=k,Me.streams[k]=H,H),closeStream:H=>{Me.streams[H]=null},chrdev_stream_ops:{open:H=>{var k=Me.getDevice(H.node.rdev);H.stream_ops=k.stream_ops,H.stream_ops.open&&H.stream_ops.open(H)},llseek:()=>{throw new Me.ErrnoError(70)}},major:H=>H>>8,minor:H=>H&255,makedev:(H,k)=>H<<8|k,registerDevice:(H,k)=>{Me.devices[H]={stream_ops:k}},getDevice:H=>Me.devices[H],getMounts:H=>{for(var k=[],ue=[H];ue.length;){var we=ue.pop();k.push(we),ue.push.apply(ue,we.mounts)}return k},syncfs:(H,k)=>{typeof H=="function"&&(k=H,H=!1),Me.syncFSRequests++,Me.syncFSRequests>1&&oe(`warning: ${Me.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);var ue=Me.getMounts(Me.root.mount),we=0;function Ce(Ze){return Me.syncFSRequests--,k(Ze)}function qe(Ze){if(Ze)return qe.errored?void 0:(qe.errored=!0,Ce(Ze));++we>=ue.length&&Ce(null)}ue.forEach(Ze=>{if(!Ze.type.syncfs)return qe(null);Ze.type.syncfs(Ze,H,qe)})},mount:(H,k,ue)=>{var we=ue==="/",Ce=!ue,qe;if(we&&Me.root)throw new Me.ErrnoError(10);if(!we&&!Ce){var Ze=Me.lookupPath(ue,{follow_mount:!1});if(ue=Ze.path,qe=Ze.node,Me.isMountpoint(qe))throw new Me.ErrnoError(10);if(!Me.isDir(qe.mode))throw new Me.ErrnoError(54)}var ve={type:H,opts:k,mountpoint:ue,mounts:[]},ot=H.mount(ve);return ot.mount=ve,ve.root=ot,we?Me.root=ot:qe&&(qe.mounted=ve,qe.mount&&qe.mount.mounts.push(ve)),ot},unmount:H=>{var k=Me.lookupPath(H,{follow_mount:!1});if(!Me.isMountpoint(k.node))throw new Me.ErrnoError(28);var ue=k.node,we=ue.mounted,Ce=Me.getMounts(we);Object.keys(Me.nameTable).forEach(Ze=>{for(var ve=Me.nameTable[Ze];ve;){var ot=ve.name_next;Ce.includes(ve.mount)&&Me.destroyNode(ve),ve=ot}}),ue.mounted=null;var qe=ue.mount.mounts.indexOf(we);ue.mount.mounts.splice(qe,1)},lookup:(H,k)=>H.node_ops.lookup(H,k),mknod:(H,k,ue)=>{var we=Me.lookupPath(H,{parent:!0}),Ce=we.node,qe=wl.basename(H);if(!qe||qe==="."||qe==="..")throw new Me.ErrnoError(28);var Ze=Me.mayCreate(Ce,qe);if(Ze)throw new Me.ErrnoError(Ze);if(!Ce.node_ops.mknod)throw new Me.ErrnoError(63);return Ce.node_ops.mknod(Ce,qe,k,ue)},create:(H,k)=>(k=k!==void 0?k:438,k&=4095,k|=32768,Me.mknod(H,k,0)),mkdir:(H,k)=>(k=k!==void 0?k:511,k&=1023,k|=16384,Me.mknod(H,k,0)),mkdirTree:(H,k)=>{for(var ue=H.split("/"),we="",Ce=0;Ce<ue.length;++Ce)if(ue[Ce]){we+="/"+ue[Ce];try{Me.mkdir(we,k)}catch(qe){if(qe.errno!=20)throw qe}}},mkdev:(H,k,ue)=>(typeof ue>"u"&&(ue=k,k=438),k|=8192,Me.mknod(H,k,ue)),symlink:(H,k)=>{if(!Cu.resolve(H))throw new Me.ErrnoError(44);var ue=Me.lookupPath(k,{parent:!0}),we=ue.node;if(!we)throw new Me.ErrnoError(44);var Ce=wl.basename(k),qe=Me.mayCreate(we,Ce);if(qe)throw new Me.ErrnoError(qe);if(!we.node_ops.symlink)throw new Me.ErrnoError(63);return we.node_ops.symlink(we,Ce,H)},rename:(H,k)=>{var ue=wl.dirname(H),we=wl.dirname(k),Ce=wl.basename(H),qe=wl.basename(k),Ze,ve,ot;if(Ze=Me.lookupPath(H,{parent:!0}),ve=Ze.node,Ze=Me.lookupPath(k,{parent:!0}),ot=Ze.node,!ve||!ot)throw new Me.ErrnoError(44);if(ve.mount!==ot.mount)throw new Me.ErrnoError(75);var Et=Me.lookupNode(ve,Ce),_t=Cu.relative(H,we);if(_t.charAt(0)!==".")throw new Me.ErrnoError(28);if(_t=Cu.relative(k,ue),_t.charAt(0)!==".")throw new Me.ErrnoError(55);var ln;try{ln=Me.lookupNode(ot,qe)}catch{}if(Et!==ln){var Qt=Me.isDir(Et.mode),kt=Me.mayDelete(ve,Ce,Qt);if(kt)throw new Me.ErrnoError(kt);if(kt=ln?Me.mayDelete(ot,qe,Qt):Me.mayCreate(ot,qe),kt)throw new Me.ErrnoError(kt);if(!ve.node_ops.rename)throw new Me.ErrnoError(63);if(Me.isMountpoint(Et)||ln&&Me.isMountpoint(ln))throw new Me.ErrnoError(10);if(ot!==ve&&(kt=Me.nodePermissions(ve,"w"),kt))throw new Me.ErrnoError(kt);Me.hashRemoveNode(Et);try{ve.node_ops.rename(Et,ot,qe)}catch(Rn){throw Rn}finally{Me.hashAddNode(Et)}}},rmdir:H=>{var k=Me.lookupPath(H,{parent:!0}),ue=k.node,we=wl.basename(H),Ce=Me.lookupNode(ue,we),qe=Me.mayDelete(ue,we,!0);if(qe)throw new Me.ErrnoError(qe);if(!ue.node_ops.rmdir)throw new Me.ErrnoError(63);if(Me.isMountpoint(Ce))throw new Me.ErrnoError(10);ue.node_ops.rmdir(ue,we),Me.destroyNode(Ce)},readdir:H=>{var k=Me.lookupPath(H,{follow:!0}),ue=k.node;if(!ue.node_ops.readdir)throw new Me.ErrnoError(54);return ue.node_ops.readdir(ue)},unlink:H=>{var k=Me.lookupPath(H,{parent:!0}),ue=k.node;if(!ue)throw new Me.ErrnoError(44);var we=wl.basename(H),Ce=Me.lookupNode(ue,we),qe=Me.mayDelete(ue,we,!1);if(qe)throw new Me.ErrnoError(qe);if(!ue.node_ops.unlink)throw new Me.ErrnoError(63);if(Me.isMountpoint(Ce))throw new Me.ErrnoError(10);ue.node_ops.unlink(ue,we),Me.destroyNode(Ce)},readlink:H=>{var k=Me.lookupPath(H),ue=k.node;if(!ue)throw new Me.ErrnoError(44);if(!ue.node_ops.readlink)throw new Me.ErrnoError(28);return Cu.resolve(Me.getPath(ue.parent),ue.node_ops.readlink(ue))},stat:(H,k)=>{var ue=Me.lookupPath(H,{follow:!k}),we=ue.node;if(!we)throw new Me.ErrnoError(44);if(!we.node_ops.getattr)throw new Me.ErrnoError(63);return we.node_ops.getattr(we)},lstat:H=>Me.stat(H,!0),chmod:(H,k,ue)=>{var we;if(typeof H=="string"){var Ce=Me.lookupPath(H,{follow:!ue});we=Ce.node}else we=H;if(!we.node_ops.setattr)throw new Me.ErrnoError(63);we.node_ops.setattr(we,{mode:k&4095|we.mode&-4096,timestamp:Date.now()})},lchmod:(H,k)=>{Me.chmod(H,k,!0)},fchmod:(H,k)=>{var ue=Me.getStreamChecked(H);Me.chmod(ue.node,k)},chown:(H,k,ue,we)=>{var Ce;if(typeof H=="string"){var qe=Me.lookupPath(H,{follow:!we});Ce=qe.node}else Ce=H;if(!Ce.node_ops.setattr)throw new Me.ErrnoError(63);Ce.node_ops.setattr(Ce,{timestamp:Date.now()})},lchown:(H,k,ue)=>{Me.chown(H,k,ue,!0)},fchown:(H,k,ue)=>{var we=Me.getStreamChecked(H);Me.chown(we.node,k,ue)},truncate:(H,k)=>{if(k<0)throw new Me.ErrnoError(28);var ue;if(typeof H=="string"){var we=Me.lookupPath(H,{follow:!0});ue=we.node}else ue=H;if(!ue.node_ops.setattr)throw new Me.ErrnoError(63);if(Me.isDir(ue.mode))throw new Me.ErrnoError(31);if(!Me.isFile(ue.mode))throw new Me.ErrnoError(28);var Ce=Me.nodePermissions(ue,"w");if(Ce)throw new Me.ErrnoError(Ce);ue.node_ops.setattr(ue,{size:k,timestamp:Date.now()})},ftruncate:(H,k)=>{var ue=Me.getStreamChecked(H);if(!(ue.flags&2097155))throw new Me.ErrnoError(28);Me.truncate(ue.node,k)},utime:(H,k,ue)=>{var we=Me.lookupPath(H,{follow:!0}),Ce=we.node;Ce.node_ops.setattr(Ce,{timestamp:Math.max(k,ue)})},open:(H,k,ue)=>{if(H==="")throw new Me.ErrnoError(44);k=typeof k=="string"?u1(k):k,ue=typeof ue>"u"?438:ue,k&64?ue=ue&4095|32768:ue=0;var we;if(typeof H=="object")we=H;else{H=wl.normalize(H);try{var Ce=Me.lookupPath(H,{follow:!(k&131072)});we=Ce.node}catch{}}var qe=!1;if(k&64)if(we){if(k&128)throw new Me.ErrnoError(20)}else we=Me.mknod(H,ue,0),qe=!0;if(!we)throw new Me.ErrnoError(44);if(Me.isChrdev(we.mode)&&(k&=-513),k&65536&&!Me.isDir(we.mode))throw new Me.ErrnoError(54);if(!qe){var Ze=Me.mayOpen(we,k);if(Ze)throw new Me.ErrnoError(Ze)}k&512&&!qe&&Me.truncate(we,0),k&=-131713;var ve=Me.createStream({node:we,path:Me.getPath(we),flags:k,seekable:!0,position:0,stream_ops:we.stream_ops,ungotten:[],error:!1});return ve.stream_ops.open&&ve.stream_ops.open(ve),y.logReadFiles&&!(k&1)&&(Me.readFiles||(Me.readFiles={}),H in Me.readFiles||(Me.readFiles[H]=1)),ve},close:H=>{if(Me.isClosed(H))throw new Me.ErrnoError(8);H.getdents&&(H.getdents=null);try{H.stream_ops.close&&H.stream_ops.close(H)}catch(k){throw k}finally{Me.closeStream(H.fd)}H.fd=null},isClosed:H=>H.fd===null,llseek:(H,k,ue)=>{if(Me.isClosed(H))throw new Me.ErrnoError(8);if(!H.seekable||!H.stream_ops.llseek)throw new Me.ErrnoError(70);if(ue!=0&&ue!=1&&ue!=2)throw new Me.ErrnoError(28);return H.position=H.stream_ops.llseek(H,k,ue),H.ungotten=[],H.position},read:(H,k,ue,we,Ce)=>{if(we<0||Ce<0)throw new Me.ErrnoError(28);if(Me.isClosed(H))throw new Me.ErrnoError(8);if((H.flags&2097155)===1)throw new Me.ErrnoError(8);if(Me.isDir(H.node.mode))throw new Me.ErrnoError(31);if(!H.stream_ops.read)throw new Me.ErrnoError(28);var qe=typeof Ce<"u";if(!qe)Ce=H.position;else if(!H.seekable)throw new Me.ErrnoError(70);var Ze=H.stream_ops.read(H,k,ue,we,Ce);return qe||(H.position+=Ze),Ze},write:(H,k,ue,we,Ce,qe)=>{if(we<0||Ce<0)throw new Me.ErrnoError(28);if(Me.isClosed(H))throw new Me.ErrnoError(8);if(!(H.flags&2097155))throw new Me.ErrnoError(8);if(Me.isDir(H.node.mode))throw new Me.ErrnoError(31);if(!H.stream_ops.write)throw new Me.ErrnoError(28);H.seekable&&H.flags&1024&&Me.llseek(H,0,2);var Ze=typeof Ce<"u";if(!Ze)Ce=H.position;else if(!H.seekable)throw new Me.ErrnoError(70);var ve=H.stream_ops.write(H,k,ue,we,Ce,qe);return Ze||(H.position+=ve),ve},allocate:(H,k,ue)=>{if(Me.isClosed(H))throw new Me.ErrnoError(8);if(k<0||ue<=0)throw new Me.ErrnoError(28);if(!(H.flags&2097155))throw new Me.ErrnoError(8);if(!Me.isFile(H.node.mode)&&!Me.isDir(H.node.mode))throw new Me.ErrnoError(43);if(!H.stream_ops.allocate)throw new Me.ErrnoError(138);H.stream_ops.allocate(H,k,ue)},mmap:(H,k,ue,we,Ce)=>{if(we&2&&!(Ce&2)&&(H.flags&2097155)!==2)throw new Me.ErrnoError(2);if((H.flags&2097155)===1)throw new Me.ErrnoError(2);if(!H.stream_ops.mmap)throw new Me.ErrnoError(43);return H.stream_ops.mmap(H,k,ue,we,Ce)},msync:(H,k,ue,we,Ce)=>H.stream_ops.msync?H.stream_ops.msync(H,k,ue,we,Ce):0,munmap:H=>0,ioctl:(H,k,ue)=>{if(!H.stream_ops.ioctl)throw new Me.ErrnoError(59);return H.stream_ops.ioctl(H,k,ue)},readFile:(H,k={})=>{if(k.flags=k.flags||0,k.encoding=k.encoding||"binary",k.encoding!=="utf8"&&k.encoding!=="binary")throw new Error(`Invalid encoding type "${k.encoding}"`);var ue,we=Me.open(H,k.flags),Ce=Me.stat(H),qe=Ce.size,Ze=new Uint8Array(qe);return Me.read(we,Ze,0,qe,0),k.encoding==="utf8"?ue=bu(Ze,0):k.encoding==="binary"&&(ue=Ze),Me.close(we),ue},writeFile:(H,k,ue={})=>{ue.flags=ue.flags||577;var we=Me.open(H,ue.flags,ue.mode);if(typeof k=="string"){var Ce=new Uint8Array(cc(k)+1),qe=kc(k,Ce,0,Ce.length);Me.write(we,Ce,0,qe,void 0,ue.canOwn)}else if(ArrayBuffer.isView(k))Me.write(we,k,0,k.byteLength,void 0,ue.canOwn);else throw new Error("Unsupported data type");Me.close(we)},cwd:()=>Me.currentPath,chdir:H=>{var k=Me.lookupPath(H,{follow:!0});if(k.node===null)throw new Me.ErrnoError(44);if(!Me.isDir(k.node.mode))throw new Me.ErrnoError(54);var ue=Me.nodePermissions(k.node,"x");if(ue)throw new Me.ErrnoError(ue);Me.currentPath=k.path},createDefaultDirectories:()=>{Me.mkdir("/tmp"),Me.mkdir("/home"),Me.mkdir("/home/web_user")},createDefaultDevices:()=>{Me.mkdir("/dev"),Me.registerDevice(Me.makedev(1,3),{read:()=>0,write:(we,Ce,qe,Ze,ve)=>Ze}),Me.mkdev("/dev/null",Me.makedev(1,3)),qa.register(Me.makedev(5,0),qa.default_tty_ops),qa.register(Me.makedev(6,0),qa.default_tty1_ops),Me.mkdev("/dev/tty",Me.makedev(5,0)),Me.mkdev("/dev/tty1",Me.makedev(6,0));var H=new Uint8Array(1024),k=0,ue=()=>(k===0&&(k=eh(H).byteLength),H[--k]);Me.createDevice("/dev","random",ue),Me.createDevice("/dev","urandom",ue),Me.mkdir("/dev/shm"),Me.mkdir("/dev/shm/tmp")},createSpecialDirectories:()=>{Me.mkdir("/proc");var H=Me.mkdir("/proc/self");Me.mkdir("/proc/self/fd"),Me.mount({mount:()=>{var k=Me.createNode(H,"fd",16895,73);return k.node_ops={lookup:(ue,we)=>{var Ce=+we,qe=Me.getStreamChecked(Ce),Ze={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>qe.path}};return Ze.parent=Ze,Ze}},k}},{},"/proc/self/fd")},createStandardStreams:()=>{y.stdin?Me.createDevice("/dev","stdin",y.stdin):Me.symlink("/dev/tty","/dev/stdin"),y.stdout?Me.createDevice("/dev","stdout",null,y.stdout):Me.symlink("/dev/tty","/dev/stdout"),y.stderr?Me.createDevice("/dev","stderr",null,y.stderr):Me.symlink("/dev/tty1","/dev/stderr"),Me.open("/dev/stdin",0),Me.open("/dev/stdout",1),Me.open("/dev/stderr",1)},ensureErrnoError:()=>{Me.ErrnoError||(Me.ErrnoError=function(k,ue){this.name="ErrnoError",this.node=ue,this.setErrno=function(we){this.errno=we},this.setErrno(k),this.message="FS error"},Me.ErrnoError.prototype=new Error,Me.ErrnoError.prototype.constructor=Me.ErrnoError,[44].forEach(H=>{Me.genericErrors[H]=new Me.ErrnoError(H),Me.genericErrors[H].stack="<generic error, no stack>"}))},staticInit:()=>{Me.ensureErrnoError(),Me.nameTable=new Array(4096),Me.mount(kn,{},"/"),Me.createDefaultDirectories(),Me.createDefaultDevices(),Me.createSpecialDirectories(),Me.filesystems={MEMFS:kn}},init:(H,k,ue)=>{Me.init.initialized=!0,Me.ensureErrnoError(),y.stdin=H||y.stdin,y.stdout=k||y.stdout,y.stderr=ue||y.stderr,Me.createStandardStreams()},quit:()=>{Me.init.initialized=!1;for(var H=0;H<Me.streams.length;H++){var k=Me.streams[H];k&&Me.close(k)}},findObject:(H,k)=>{var ue=Me.analyzePath(H,k);return ue.exists?ue.object:null},analyzePath:(H,k)=>{try{var ue=Me.lookupPath(H,{follow:!k});H=ue.path}catch{}var we={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var ue=Me.lookupPath(H,{parent:!0});we.parentExists=!0,we.parentPath=ue.path,we.parentObject=ue.node,we.name=wl.basename(H),ue=Me.lookupPath(H,{follow:!k}),we.exists=!0,we.path=ue.path,we.object=ue.node,we.name=ue.node.name,we.isRoot=ue.path==="/"}catch(Ce){we.error=Ce.errno}return we},createPath:(H,k,ue,we)=>{H=typeof H=="string"?H:Me.getPath(H);for(var Ce=k.split("/").reverse();Ce.length;){var qe=Ce.pop();if(qe){var Ze=wl.join2(H,qe);try{Me.mkdir(Ze)}catch{}H=Ze}}return Ze},createFile:(H,k,ue,we,Ce)=>{var qe=wl.join2(typeof H=="string"?H:Me.getPath(H),k),Ze=nh(we,Ce);return Me.create(qe,Ze)},createDataFile:(H,k,ue,we,Ce,qe)=>{var Ze=k;H&&(H=typeof H=="string"?H:Me.getPath(H),Ze=k?wl.join2(H,k):H);var ve=nh(we,Ce),ot=Me.create(Ze,ve);if(ue){if(typeof ue=="string"){for(var Et=new Array(ue.length),_t=0,ln=ue.length;_t<ln;++_t)Et[_t]=ue.charCodeAt(_t);ue=Et}Me.chmod(ot,ve|146);var Qt=Me.open(ot,577);Me.write(Qt,ue,0,ue.length,0,qe),Me.close(Qt),Me.chmod(ot,ve)}return ot},createDevice:(H,k,ue,we)=>{var Ce=wl.join2(typeof H=="string"?H:Me.getPath(H),k),qe=nh(!!ue,!!we);Me.createDevice.major||(Me.createDevice.major=64);var Ze=Me.makedev(Me.createDevice.major++,0);return Me.registerDevice(Ze,{open:ve=>{ve.seekable=!1},close:ve=>{we&&we.buffer&&we.buffer.length&&we(10)},read:(ve,ot,Et,_t,ln)=>{for(var Qt=0,kt=0;kt<_t;kt++){var Rn;try{Rn=ue()}catch{throw new Me.ErrnoError(29)}if(Rn===void 0&&Qt===0)throw new Me.ErrnoError(6);if(Rn==null)break;Qt++,ot[Et+kt]=Rn}return Qt&&(ve.node.timestamp=Date.now()),Qt},write:(ve,ot,Et,_t,ln)=>{for(var Qt=0;Qt<_t;Qt++)try{we(ot[Et+Qt])}catch{throw new Me.ErrnoError(29)}return _t&&(ve.node.timestamp=Date.now()),Qt}}),Me.mkdev(Ce,qe,Ze)},forceLoadFile:H=>{if(H.isDevice||H.isFolder||H.link||H.contents)return!0;if(typeof XMLHttpRequest<"u")throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");if(te)try{H.contents=dc(te(H.url),!0),H.usedBytes=H.contents.length}catch{throw new Me.ErrnoError(29)}else throw new Error("Cannot load without read() or XMLHttpRequest.")},createLazyFile:(H,k,ue,we,Ce)=>{function qe(){this.lengthKnown=!1,this.chunks=[]}if(qe.prototype.get=function(kt){if(!(kt>this.length-1||kt<0)){var Rn=kt%this.chunkSize,ul=kt/this.chunkSize|0;return this.getter(ul)[Rn]}},qe.prototype.setDataGetter=function(kt){this.getter=kt},qe.prototype.cacheLength=function(){var kt=new XMLHttpRequest;if(kt.open("HEAD",ue,!1),kt.send(null),!(kt.status>=200&&kt.status<300||kt.status===304))throw new Error("Couldn't load "+ue+". Status: "+kt.status);var Rn=Number(kt.getResponseHeader("Content-length")),ul,ol=(ul=kt.getResponseHeader("Accept-Ranges"))&&ul==="bytes",El=(ul=kt.getResponseHeader("Content-Encoding"))&&ul==="gzip",Mt=1024*1024;ol||(Mt=Rn);var un=(hl,Xs)=>{if(hl>Xs)throw new Error("invalid range ("+hl+", "+Xs+") or no bytes requested!");if(Xs>Rn-1)throw new Error("only "+Rn+" bytes available! programmer error!");var ts=new XMLHttpRequest;if(ts.open("GET",ue,!1),Rn!==Mt&&ts.setRequestHeader("Range","bytes="+hl+"-"+Xs),ts.responseType="arraybuffer",ts.overrideMimeType&&ts.overrideMimeType("text/plain; charset=x-user-defined"),ts.send(null),!(ts.status>=200&&ts.status<300||ts.status===304))throw new Error("Couldn't load "+ue+". Status: "+ts.status);return ts.response!==void 0?new Uint8Array(ts.response||[]):dc(ts.responseText||"",!0)},Ts=this;Ts.setDataGetter(hl=>{var Xs=hl*Mt,ts=(hl+1)*Mt-1;if(ts=Math.min(ts,Rn-1),typeof Ts.chunks[hl]>"u"&&(Ts.chunks[hl]=un(Xs,ts)),typeof Ts.chunks[hl]>"u")throw new Error("doXHR failed!");return Ts.chunks[hl]}),(El||!Rn)&&(Mt=Rn=1,Rn=this.getter(0).length,Mt=Rn,de("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=Rn,this._chunkSize=Mt,this.lengthKnown=!0},typeof XMLHttpRequest<"u"){throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var Ze,ve}else var ve={isDevice:!1,url:ue};var ot=Me.createFile(H,k,ve,we,Ce);ve.contents?ot.contents=ve.contents:ve.url&&(ot.contents=null,ot.url=ve.url),Object.defineProperties(ot,{usedBytes:{get:function(){return this.contents.length}}});var Et={},_t=Object.keys(ot.stream_ops);_t.forEach(Qt=>{var kt=ot.stream_ops[Qt];Et[Qt]=function(){return Me.forceLoadFile(ot),kt.apply(null,arguments)}});function ln(Qt,kt,Rn,ul,ol){var El=Qt.node.contents;if(ol>=El.length)return 0;var Mt=Math.min(El.length-ol,ul);if(El.slice)for(var un=0;un<Mt;un++)kt[Rn+un]=El[ol+un];else for(var un=0;un<Mt;un++)kt[Rn+un]=El.get(ol+un);return Mt}return Et.read=(Qt,kt,Rn,ul,ol)=>(Me.forceLoadFile(ot),ln(Qt,kt,Rn,ul,ol)),Et.mmap=(Qt,kt,Rn,ul,ol)=>{Me.forceLoadFile(ot);var El=dI();if(!El)throw new Me.ErrnoError(48);return ln(Qt,Be,El,kt,Rn),{ptr:El,allocated:!0}},ot.stream_ops=Et,ot}},vu={DEFAULT_POLLMASK:5,calculateAt:function(H,k,ue){if(wl.isAbs(k))return k;var we;if(H===-100)we=Me.cwd();else{var Ce=vu.getStreamFromFD(H);we=Ce.path}if(k.length==0){if(!ue)throw new Me.ErrnoError(44);return we}return wl.join2(we,k)},doStat:function(H,k,ue){try{var we=H(k)}catch(ve){if(ve&&ve.node&&wl.normalize(k)!==wl.normalize(Me.getPath(ve.node)))return-54;throw ve}Le[ue>>>2]=we.dev,Le[ue+4>>>2]=we.mode,Xe[ue+8>>>2]=we.nlink,Le[ue+12>>>2]=we.uid,Le[ue+16>>>2]=we.gid,Le[ue+20>>>2]=we.rdev,We=[we.size>>>0,(Ye=we.size,+Math.abs(Ye)>=1?Ye>0?+Math.floor(Ye/4294967296)>>>0:~~+Math.ceil((Ye-+(~~Ye>>>0))/4294967296)>>>0:0)],Le[ue+24>>>2]=We[0],Le[ue+28>>>2]=We[1],Le[ue+32>>>2]=4096,Le[ue+36>>>2]=we.blocks;var Ce=we.atime.getTime(),qe=we.mtime.getTime(),Ze=we.ctime.getTime();return We=[Math.floor(Ce/1e3)>>>0,(Ye=Math.floor(Ce/1e3),+Math.abs(Ye)>=1?Ye>0?+Math.floor(Ye/4294967296)>>>0:~~+Math.ceil((Ye-+(~~Ye>>>0))/4294967296)>>>0:0)],Le[ue+40>>>2]=We[0],Le[ue+44>>>2]=We[1],Xe[ue+48>>>2]=Ce%1e3*1e3,We=[Math.floor(qe/1e3)>>>0,(Ye=Math.floor(qe/1e3),+Math.abs(Ye)>=1?Ye>0?+Math.floor(Ye/4294967296)>>>0:~~+Math.ceil((Ye-+(~~Ye>>>0))/4294967296)>>>0:0)],Le[ue+56>>>2]=We[0],Le[ue+60>>>2]=We[1],Xe[ue+64>>>2]=qe%1e3*1e3,We=[Math.floor(Ze/1e3)>>>0,(Ye=Math.floor(Ze/1e3),+Math.abs(Ye)>=1?Ye>0?+Math.floor(Ye/4294967296)>>>0:~~+Math.ceil((Ye-+(~~Ye>>>0))/4294967296)>>>0:0)],Le[ue+72>>>2]=We[0],Le[ue+76>>>2]=We[1],Xe[ue+80>>>2]=Ze%1e3*1e3,We=[we.ino>>>0,(Ye=we.ino,+Math.abs(Ye)>=1?Ye>0?+Math.floor(Ye/4294967296)>>>0:~~+Math.ceil((Ye-+(~~Ye>>>0))/4294967296)>>>0:0)],Le[ue+88>>>2]=We[0],Le[ue+92>>>2]=We[1],0},doMsync:function(H,k,ue,we,Ce){if(!Me.isFile(k.node.mode))throw new Me.ErrnoError(43);if(we&2)return 0;var qe=Fe.slice(H,H+ue);Me.msync(k,qe,Ce,ue,we)},varargs:void 0,get(){vu.varargs+=4;var H=Le[vu.varargs-4>>>2];return H},getStr(H){var k=hc(H);return k},getStreamFromFD:function(H){var k=Me.getStreamChecked(H);return k}};function a1(H,k){H>>>=0,k>>>=0;var ue=0;return Fi().forEach(function(we,Ce){var qe=k+ue;Xe[H+Ce*4>>>2]=qe,vd(we,qe),ue+=we.length+1}),0}function lh(H,k){H>>>=0,k>>>=0;var ue=Fi();Xe[H>>>2]=ue.length;var we=0;return ue.forEach(function(Ce){we+=Ce.length+1}),Xe[k>>>2]=we,0}function yc(H){try{var k=vu.getStreamFromFD(H);return Me.close(k),0}catch(ue){if(typeof Me>"u"||ue.name!=="ErrnoError")throw ue;return ue.errno}}function i1(H,k){k>>>=0;try{var ue=0,we=0,Ce=0,qe=vu.getStreamFromFD(H),Ze=qe.tty?2:Me.isDir(qe.mode)?3:Me.isLink(qe.mode)?7:4;return Be[k>>>0]=Ze,Je[k+2>>>1]=Ce,We=[ue>>>0,(Ye=ue,+Math.abs(Ye)>=1?Ye>0?+Math.floor(Ye/4294967296)>>>0:~~+Math.ceil((Ye-+(~~Ye>>>0))/4294967296)>>>0:0)],Le[k+8>>>2]=We[0],Le[k+12>>>2]=We[1],We=[we>>>0,(Ye=we,+Math.abs(Ye)>=1?Ye>0?+Math.floor(Ye/4294967296)>>>0:~~+Math.ceil((Ye-+(~~Ye>>>0))/4294967296)>>>0:0)],Le[k+16>>>2]=We[0],Le[k+20>>>2]=We[1],0}catch(ve){if(typeof Me>"u"||ve.name!=="ErrnoError")throw ve;return ve.errno}}var o1=(H,k,ue,we)=>{for(var Ce=0,qe=0;qe<ue;qe++){var Ze=Xe[k>>>2],ve=Xe[k+4>>>2];k+=8;var ot=Me.read(H,Be,Ze,ve,we);if(ot<0)return-1;if(Ce+=ot,ot<ve)break}return Ce};function c1(H,k,ue,we){k>>>=0,ue>>>=0,we>>>=0;try{var Ce=vu.getStreamFromFD(H),qe=o1(Ce,k,ue);return Xe[we>>>2]=qe,0}catch(Ze){if(typeof Me>"u"||Ze.name!=="ErrnoError")throw Ze;return Ze.errno}}function sh(H,k,ue,we,Ce){var qe=Wt(k,ue);Ce>>>=0;try{if(isNaN(qe))return 61;var Ze=vu.getStreamFromFD(H);return Me.llseek(Ze,qe,we),We=[Ze.position>>>0,(Ye=Ze.position,+Math.abs(Ye)>=1?Ye>0?+Math.floor(Ye/4294967296)>>>0:~~+Math.ceil((Ye-+(~~Ye>>>0))/4294967296)>>>0:0)],Le[Ce>>>2]=We[0],Le[Ce+4>>>2]=We[1],Ze.getdents&&qe===0&&we===0&&(Ze.getdents=null),0}catch(ve){if(typeof Me>"u"||ve.name!=="ErrnoError")throw ve;return ve.errno}}var h1=(H,k,ue,we)=>{for(var Ce=0,qe=0;qe<ue;qe++){var Ze=Xe[k>>>2],ve=Xe[k+4>>>2];k+=8;var ot=Me.write(H,Be,Ze,ve,we);if(ot<0)return-1;Ce+=ot}return Ce};function f1(H,k,ue,we){k>>>=0,ue>>>=0,we>>>=0;try{var Ce=vu.getStreamFromFD(H),qe=h1(Ce,k,ue);return Xe[we>>>2]=qe,0}catch(Ze){if(typeof Me>"u"||Ze.name!=="ErrnoError")throw Ze;return Ze.errno}}var I1=(H,k)=>{for(var ue=0,we=0;we<=k;ue+=H[we++]);return ue},yI=[31,29,31,30,31,30,31,31,30,31,30,31],rh=[31,28,31,30,31,30,31,31,30,31,30,31],wI=(H,k)=>{for(var ue=new Date(H.getTime());k>0;){var we=Ui(ue.getFullYear()),Ce=ue.getMonth(),qe=(we?yI:rh)[Ce];if(k>qe-ue.getDate())k-=qe-ue.getDate()+1,ue.setDate(1),Ce<11?ue.setMonth(Ce+1):(ue.setMonth(0),ue.setFullYear(ue.getFullYear()+1));else return ue.setDate(ue.getDate()+k),ue}return ue},d1=(H,k)=>{Be.set(H,k>>>0)};function y1(H,k,ue,we){H>>>=0,k>>>=0,ue>>>=0,we>>>=0;var Ce=Le[we+40>>>2],qe={tm_sec:Le[we>>>2],tm_min:Le[we+4>>>2],tm_hour:Le[we+8>>>2],tm_mday:Le[we+12>>>2],tm_mon:Le[we+16>>>2],tm_year:Le[we+20>>>2],tm_wday:Le[we+24>>>2],tm_yday:Le[we+28>>>2],tm_isdst:Le[we+32>>>2],tm_gmtoff:Le[we+36>>>2],tm_zone:Ce?hc(Ce):""},Ze=hc(ue),ve={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var ot in ve)Ze=Ze.replace(new RegExp(ot,"g"),ve[ot]);var Et=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],_t=["January","February","March","April","May","June","July","August","September","October","November","December"];function ln(Mt,un,Ts){for(var hl=typeof Mt=="number"?Mt.toString():Mt||"";hl.length<un;)hl=Ts[0]+hl;return hl}function Qt(Mt,un){return ln(Mt,un,"0")}function kt(Mt,un){function Ts(Xs){return Xs<0?-1:Xs>0?1:0}var hl;return(hl=Ts(Mt.getFullYear()-un.getFullYear()))===0&&(hl=Ts(Mt.getMonth()-un.getMonth()))===0&&(hl=Ts(Mt.getDate()-un.getDate())),hl}function Rn(Mt){switch(Mt.getDay()){case 0:return new Date(Mt.getFullYear()-1,11,29);case 1:return Mt;case 2:return new Date(Mt.getFullYear(),0,3);case 3:return new Date(Mt.getFullYear(),0,2);case 4:return new Date(Mt.getFullYear(),0,1);case 5:return new Date(Mt.getFullYear()-1,11,31);case 6:return new Date(Mt.getFullYear()-1,11,30)}}function ul(Mt){var un=wI(new Date(Mt.tm_year+1900,0,1),Mt.tm_yday),Ts=new Date(un.getFullYear(),0,4),hl=new Date(un.getFullYear()+1,0,4),Xs=Rn(Ts),ts=Rn(hl);return kt(Xs,un)<=0?kt(ts,un)<=0?un.getFullYear()+1:un.getFullYear():un.getFullYear()-1}var ol={"%a":Mt=>Et[Mt.tm_wday].substring(0,3),"%A":Mt=>Et[Mt.tm_wday],"%b":Mt=>_t[Mt.tm_mon].substring(0,3),"%B":Mt=>_t[Mt.tm_mon],"%C":Mt=>{var un=Mt.tm_year+1900;return Qt(un/100|0,2)},"%d":Mt=>Qt(Mt.tm_mday,2),"%e":Mt=>ln(Mt.tm_mday,2," "),"%g":Mt=>ul(Mt).toString().substring(2),"%G":Mt=>ul(Mt),"%H":Mt=>Qt(Mt.tm_hour,2),"%I":Mt=>{var un=Mt.tm_hour;return un==0?un=12:un>12&&(un-=12),Qt(un,2)},"%j":Mt=>Qt(Mt.tm_mday+I1(Ui(Mt.tm_year+1900)?yI:rh,Mt.tm_mon-1),3),"%m":Mt=>Qt(Mt.tm_mon+1,2),"%M":Mt=>Qt(Mt.tm_min,2),"%n":()=>`