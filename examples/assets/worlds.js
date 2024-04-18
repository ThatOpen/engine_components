var vh=Object.defineProperty;var Eh=(i,t,e)=>t in i?vh(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var ht=(i,t,e)=>(Eh(i,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const oa="160",Mh={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Sh=0,wa=1,yh=2,Cl=1,Th=2,yn=3,_n=0,Oe=1,mn=2,Gn=0,Xi=1,Ca=2,Ra=3,Pa=4,Ah=5,ei=100,bh=101,wh=102,La=103,Ua=104,Ch=200,Rh=201,Ph=202,Lh=203,Ho=204,Vo=205,Uh=206,Dh=207,Ih=208,Oh=209,Nh=210,Fh=211,Bh=212,zh=213,Hh=214,Vh=0,Gh=1,kh=2,yr=3,Wh=4,Xh=5,Yh=6,qh=7,Rl=0,Zh=1,Kh=2,kn=0,$h=1,jh=2,Jh=3,Qh=4,tu=5,eu=6,Pl=300,qi=301,Zi=302,Go=303,ko=304,Or=306,Wo=1e3,an=1001,Xo=1002,Ie=1003,Da=1004,Yr=1005,qe=1006,nu=1007,As=1008,Wn=1009,iu=1010,su=1011,aa=1012,Ll=1013,zn=1014,Hn=1015,bs=1016,Ul=1017,Dl=1018,ii=1020,ru=1021,cn=1023,ou=1024,au=1025,si=1026,Ki=1027,cu=1028,Il=1029,lu=1030,Ol=1031,Nl=1033,qr=33776,Zr=33777,Kr=33778,$r=33779,Ia=35840,Oa=35841,Na=35842,Fa=35843,Fl=36196,Ba=37492,za=37496,Ha=37808,Va=37809,Ga=37810,ka=37811,Wa=37812,Xa=37813,Ya=37814,qa=37815,Za=37816,Ka=37817,$a=37818,ja=37819,Ja=37820,Qa=37821,jr=36492,tc=36494,ec=36495,hu=36283,nc=36284,ic=36285,sc=36286,Bl=3e3,ri=3001,uu=3200,fu=3201,du=0,pu=1,Ke="",Me="srgb",Cn="srgb-linear",ca="display-p3",Nr="display-p3-linear",Tr="linear",ie="srgb",Ar="rec709",br="p3",hi=7680,rc=519,mu=512,_u=513,gu=514,zl=515,xu=516,vu=517,Eu=518,Mu=519,oc=35044,ac="300 es",Yo=1035,bn=2e3,wr=2001;let ji=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}};const Ae=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let cc=1234567;const Es=Math.PI/180,ws=180/Math.PI;function Ji(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ae[i&255]+Ae[i>>8&255]+Ae[i>>16&255]+Ae[i>>24&255]+"-"+Ae[t&255]+Ae[t>>8&255]+"-"+Ae[t>>16&15|64]+Ae[t>>24&255]+"-"+Ae[e&63|128]+Ae[e>>8&255]+"-"+Ae[e>>16&255]+Ae[e>>24&255]+Ae[n&255]+Ae[n>>8&255]+Ae[n>>16&255]+Ae[n>>24&255]).toLowerCase()}function Se(i,t,e){return Math.max(t,Math.min(e,i))}function la(i,t){return(i%t+t)%t}function Su(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function yu(i,t,e){return i!==t?(e-i)/(t-i):0}function Ms(i,t,e){return(1-e)*i+e*t}function Tu(i,t,e,n){return Ms(i,t,1-Math.exp(-e*n))}function Au(i,t=1){return t-Math.abs(la(i,t*2)-t)}function bu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function wu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Cu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ru(i,t){return i+Math.random()*(t-i)}function Pu(i){return i*(.5-Math.random())}function Lu(i){i!==void 0&&(cc=i);let t=cc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Uu(i){return i*Es}function Du(i){return i*ws}function qo(i){return(i&i-1)===0&&i!==0}function Iu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Cr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ou(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),h=a((t+n)/2),f=r((t-n)/2),u=a((t-n)/2),p=r((n-t)/2),_=a((n-t)/2);switch(s){case"XYX":i.set(o*h,c*f,c*u,o*l);break;case"YZY":i.set(c*u,o*h,c*f,o*l);break;case"ZXZ":i.set(c*f,c*u,o*h,o*l);break;case"XZX":i.set(o*h,c*_,c*p,o*l);break;case"YXY":i.set(c*p,o*h,c*_,o*l);break;case"ZYZ":i.set(c*_,c*p,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Vi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ue(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Nu={DEG2RAD:Es,RAD2DEG:ws,generateUUID:Ji,clamp:Se,euclideanModulo:la,mapLinear:Su,inverseLerp:yu,lerp:Ms,damp:Tu,pingpong:Au,smoothstep:bu,smootherstep:wu,randInt:Cu,randFloat:Ru,randFloatSpread:Pu,seededRandom:Lu,degToRad:Uu,radToDeg:Du,isPowerOfTwo:qo,ceilPowerOfTwo:Iu,floorPowerOfTwo:Cr,setQuaternionFromProperEuler:Ou,normalize:Ue,denormalize:Vi};class kt{constructor(t=0,e=0){kt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gt{constructor(t,e,n,s,r,a,o,c,l){Gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],f=n[7],u=n[2],p=n[5],_=n[8],x=s[0],m=s[3],d=s[6],M=s[1],v=s[4],g=s[7],y=s[2],A=s[5],T=s[8];return r[0]=a*x+o*M+c*y,r[3]=a*m+o*v+c*A,r[6]=a*d+o*g+c*T,r[1]=l*x+h*M+f*y,r[4]=l*m+h*v+f*A,r[7]=l*d+h*g+f*T,r[2]=u*x+p*M+_*y,r[5]=u*m+p*v+_*A,r[8]=u*d+p*g+_*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=h*a-o*l,u=o*c-h*r,p=l*r-a*c,_=e*f+n*u+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/_;return t[0]=f*x,t[1]=(s*l-h*n)*x,t[2]=(o*n-s*a)*x,t[3]=u*x,t[4]=(h*e-s*c)*x,t[5]=(s*r-o*e)*x,t[6]=p*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Jr.makeScale(t,e)),this}rotate(t){return this.premultiply(Jr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Jr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Jr=new Gt;function Hl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Rr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Fu(){const i=Rr("canvas");return i.style.display="block",i}const lc={};function Ss(i){i in lc||(lc[i]=!0,console.warn(i))}const hc=new Gt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),uc=new Gt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Us={[Cn]:{transfer:Tr,primaries:Ar,toReference:i=>i,fromReference:i=>i},[Me]:{transfer:ie,primaries:Ar,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Nr]:{transfer:Tr,primaries:br,toReference:i=>i.applyMatrix3(uc),fromReference:i=>i.applyMatrix3(hc)},[ca]:{transfer:ie,primaries:br,toReference:i=>i.convertSRGBToLinear().applyMatrix3(uc),fromReference:i=>i.applyMatrix3(hc).convertLinearToSRGB()}},Bu=new Set([Cn,Nr]),Jt={enabled:!0,_workingColorSpace:Cn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Bu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Us[t].toReference,s=Us[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Us[i].primaries},getTransfer:function(i){return i===Ke?Tr:Us[i].transfer}};function Yi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Qr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ui;class Vl{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ui===void 0&&(ui=Rr("canvas")),ui.width=t.width,ui.height=t.height;const n=ui.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ui}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Rr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Yi(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Yi(e[n]/255)*255):e[n]=Yi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let zu=0;class Gl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=Ji(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(to(s[a].image)):r.push(to(s[a]))}else r=to(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function to(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Vl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Hu=0;class ke extends ji{constructor(t=ke.DEFAULT_IMAGE,e=ke.DEFAULT_MAPPING,n=an,s=an,r=qe,a=As,o=cn,c=Wn,l=ke.DEFAULT_ANISOTROPY,h=Ke){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hu++}),this.uuid=Ji(),this.name="",this.source=new Gl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new kt(0,0),this.repeat=new kt(1,1),this.center=new kt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Ss("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ri?Me:Ke),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Pl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Wo:t.x=t.x-Math.floor(t.x);break;case an:t.x=t.x<0?0:1;break;case Xo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Wo:t.y=t.y-Math.floor(t.y);break;case an:t.y=t.y<0?0:1;break;case Xo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ss("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Me?ri:Bl}set encoding(t){Ss("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===ri?Me:Ke}}ke.DEFAULT_IMAGE=null;ke.DEFAULT_MAPPING=Pl;ke.DEFAULT_ANISOTROPY=1;class pe{constructor(t=0,e=0,n=0,s=1){pe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],f=c[8],u=c[1],p=c[5],_=c[9],x=c[2],m=c[6],d=c[10];if(Math.abs(h-u)<.01&&Math.abs(f-x)<.01&&Math.abs(_-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+x)<.1&&Math.abs(_+m)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,g=(p+1)/2,y=(d+1)/2,A=(h+u)/4,T=(f+x)/4,P=(_+m)/4;return v>g&&v>y?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=A/n,r=T/n):g>y?g<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(g),n=A/s,r=P/s):y<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(y),n=T/r,s=P/r),this.set(n,s,r,e),this}let M=Math.sqrt((m-_)*(m-_)+(f-x)*(f-x)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-_)/M,this.y=(f-x)/M,this.z=(u-h)/M,this.w=Math.acos((l+p+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Vu extends ji{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(Ss("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ri?Me:Ke),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qe,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new ke(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Gl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ai extends Vu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class kl extends ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=an,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gu extends ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=an,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3];const u=r[a+0],p=r[a+1],_=r[a+2],x=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=u,t[e+1]=p,t[e+2]=_,t[e+3]=x;return}if(f!==x||c!==u||l!==p||h!==_){let m=1-o;const d=c*u+l*p+h*_+f*x,M=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){const y=Math.sqrt(v),A=Math.atan2(y,d*M);m=Math.sin(m*A)/y,o=Math.sin(o*A)/y}const g=o*M;if(c=c*m+u*g,l=l*m+p*g,h=h*m+_*g,f=f*m+x*g,m===1-o){const y=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=y,l*=y,h*=y,f*=y}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=r[a],u=r[a+1],p=r[a+2],_=r[a+3];return t[e]=o*_+h*f+c*p-l*u,t[e+1]=c*_+h*u+l*f-o*p,t[e+2]=l*_+h*p+o*u-c*f,t[e+3]=h*_-o*f-c*u-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),f=o(r/2),u=c(n/2),p=c(s/2),_=c(r/2);switch(a){case"XYZ":this._x=u*h*f+l*p*_,this._y=l*p*f-u*h*_,this._z=l*h*_+u*p*f,this._w=l*h*f-u*p*_;break;case"YXZ":this._x=u*h*f+l*p*_,this._y=l*p*f-u*h*_,this._z=l*h*_-u*p*f,this._w=l*h*f+u*p*_;break;case"ZXY":this._x=u*h*f-l*p*_,this._y=l*p*f+u*h*_,this._z=l*h*_+u*p*f,this._w=l*h*f-u*p*_;break;case"ZYX":this._x=u*h*f-l*p*_,this._y=l*p*f+u*h*_,this._z=l*h*_-u*p*f,this._w=l*h*f+u*p*_;break;case"YZX":this._x=u*h*f+l*p*_,this._y=l*p*f+u*h*_,this._z=l*h*_-u*p*f,this._w=l*h*f-u*p*_;break;case"XZY":this._x=u*h*f-l*p*_,this._y=l*p*f-u*h*_,this._z=l*h*_+u*p*f,this._w=l*h*f+u*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],f=e[10],u=n+o+f;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>f){const p=2*Math.sqrt(1+n-o-f);this._w=(h-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>f){const p=2*Math.sqrt(1+o-n-f);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+f-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Se(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),f=Math.sin((1-e)*h)/l,u=Math.sin(e*h)/l;return this._w=a*f+this._w*u,this._x=n*f+this._x*u,this._y=s*f+this._y*u,this._z=r*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(fc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(fc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),h=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+c*l+a*f-o*h,this.y=n+c*h+o*l-r*f,this.z=s+c*f+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return eo.copy(this).projectOnVector(t),this.sub(eo)}reflect(t){return this.sub(eo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const eo=new L,fc=new Qi;class ye{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(en.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(en.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=en.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,en):en.fromBufferAttribute(r,a),en.applyMatrix4(t.matrixWorld),this.expandByPoint(en);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ds.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ds.copy(n.boundingBox)),Ds.applyMatrix4(t.matrixWorld),this.union(Ds)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,en),en.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(rs),Is.subVectors(this.max,rs),fi.subVectors(t.a,rs),di.subVectors(t.b,rs),pi.subVectors(t.c,rs),Ln.subVectors(di,fi),Un.subVectors(pi,di),Zn.subVectors(fi,pi);let e=[0,-Ln.z,Ln.y,0,-Un.z,Un.y,0,-Zn.z,Zn.y,Ln.z,0,-Ln.x,Un.z,0,-Un.x,Zn.z,0,-Zn.x,-Ln.y,Ln.x,0,-Un.y,Un.x,0,-Zn.y,Zn.x,0];return!no(e,fi,di,pi,Is)||(e=[1,0,0,0,1,0,0,0,1],!no(e,fi,di,pi,Is))?!1:(Os.crossVectors(Ln,Un),e=[Os.x,Os.y,Os.z],no(e,fi,di,pi,Is))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,en).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(en).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(xn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const xn=[new L,new L,new L,new L,new L,new L,new L,new L],en=new L,Ds=new ye,fi=new L,di=new L,pi=new L,Ln=new L,Un=new L,Zn=new L,rs=new L,Is=new L,Os=new L,Kn=new L;function no(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Kn.fromArray(i,r);const o=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),c=t.dot(Kn),l=e.dot(Kn),h=n.dot(Kn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const ku=new ye,os=new L,io=new L;class Rs{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ku.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;os.subVectors(t,this.center);const e=os.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(os,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(io.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(os.copy(t.center).add(io)),this.expandByPoint(os.copy(t.center).sub(io))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const vn=new L,so=new L,Ns=new L,Dn=new L,ro=new L,Fs=new L,oo=new L;class ha{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,vn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=vn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(vn.copy(this.origin).addScaledVector(this.direction,e),vn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){so.copy(t).add(e).multiplyScalar(.5),Ns.copy(e).sub(t).normalize(),Dn.copy(this.origin).sub(so);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ns),o=Dn.dot(this.direction),c=-Dn.dot(Ns),l=Dn.lengthSq(),h=Math.abs(1-a*a);let f,u,p,_;if(h>0)if(f=a*c-o,u=a*o-c,_=r*h,f>=0)if(u>=-_)if(u<=_){const x=1/h;f*=x,u*=x,p=f*(f+a*u+2*o)+u*(a*f+u+2*c)+l}else u=r,f=Math.max(0,-(a*u+o)),p=-f*f+u*(u+2*c)+l;else u=-r,f=Math.max(0,-(a*u+o)),p=-f*f+u*(u+2*c)+l;else u<=-_?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-c),r),p=-f*f+u*(u+2*c)+l):u<=_?(f=0,u=Math.min(Math.max(-r,-c),r),p=u*(u+2*c)+l):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-c),r),p=-f*f+u*(u+2*c)+l);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),p=-f*f+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(so).addScaledVector(Ns,u),p}intersectSphere(t,e){vn.subVectors(t.center,this.origin);const n=vn.dot(this.direction),s=vn.dot(vn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,s=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,s=(t.min.x-u.x)*l),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-u.z)*f,c=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,c=(t.min.z-u.z)*f),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,vn)!==null}intersectTriangle(t,e,n,s,r){ro.subVectors(e,t),Fs.subVectors(n,t),oo.crossVectors(ro,Fs);let a=this.direction.dot(oo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Dn.subVectors(this.origin,t);const c=o*this.direction.dot(Fs.crossVectors(Dn,Fs));if(c<0)return null;const l=o*this.direction.dot(ro.cross(Dn));if(l<0||c+l>a)return null;const h=-o*Dn.dot(oo);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Kt{constructor(t,e,n,s,r,a,o,c,l,h,f,u,p,_,x,m){Kt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,h,f,u,p,_,x,m)}set(t,e,n,s,r,a,o,c,l,h,f,u,p,_,x,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=c,d[2]=l,d[6]=h,d[10]=f,d[14]=u,d[3]=p,d[7]=_,d[11]=x,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Kt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/mi.setFromMatrixColumn(t,0).length(),r=1/mi.setFromMatrixColumn(t,1).length(),a=1/mi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const u=a*h,p=a*f,_=o*h,x=o*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=p+_*l,e[5]=u-x*l,e[9]=-o*c,e[2]=x-u*l,e[6]=_+p*l,e[10]=a*c}else if(t.order==="YXZ"){const u=c*h,p=c*f,_=l*h,x=l*f;e[0]=u+x*o,e[4]=_*o-p,e[8]=a*l,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=p*o-_,e[6]=x+u*o,e[10]=a*c}else if(t.order==="ZXY"){const u=c*h,p=c*f,_=l*h,x=l*f;e[0]=u-x*o,e[4]=-a*f,e[8]=_+p*o,e[1]=p+_*o,e[5]=a*h,e[9]=x-u*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const u=a*h,p=a*f,_=o*h,x=o*f;e[0]=c*h,e[4]=_*l-p,e[8]=u*l+x,e[1]=c*f,e[5]=x*l+u,e[9]=p*l-_,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const u=a*c,p=a*l,_=o*c,x=o*l;e[0]=c*h,e[4]=x-u*f,e[8]=_*f+p,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=p*f+_,e[10]=u-x*f}else if(t.order==="XZY"){const u=a*c,p=a*l,_=o*c,x=o*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=u*f+x,e[5]=a*h,e[9]=p*f-_,e[2]=_*f-p,e[6]=o*h,e[10]=x*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Wu,t,Xu)}lookAt(t,e,n){const s=this.elements;return ze.subVectors(t,e),ze.lengthSq()===0&&(ze.z=1),ze.normalize(),In.crossVectors(n,ze),In.lengthSq()===0&&(Math.abs(n.z)===1?ze.x+=1e-4:ze.z+=1e-4,ze.normalize(),In.crossVectors(n,ze)),In.normalize(),Bs.crossVectors(ze,In),s[0]=In.x,s[4]=Bs.x,s[8]=ze.x,s[1]=In.y,s[5]=Bs.y,s[9]=ze.y,s[2]=In.z,s[6]=Bs.z,s[10]=ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],f=n[5],u=n[9],p=n[13],_=n[2],x=n[6],m=n[10],d=n[14],M=n[3],v=n[7],g=n[11],y=n[15],A=s[0],T=s[4],P=s[8],E=s[12],S=s[1],D=s[5],I=s[9],B=s[13],R=s[2],O=s[6],F=s[10],Y=s[14],q=s[3],Z=s[7],K=s[11],et=s[15];return r[0]=a*A+o*S+c*R+l*q,r[4]=a*T+o*D+c*O+l*Z,r[8]=a*P+o*I+c*F+l*K,r[12]=a*E+o*B+c*Y+l*et,r[1]=h*A+f*S+u*R+p*q,r[5]=h*T+f*D+u*O+p*Z,r[9]=h*P+f*I+u*F+p*K,r[13]=h*E+f*B+u*Y+p*et,r[2]=_*A+x*S+m*R+d*q,r[6]=_*T+x*D+m*O+d*Z,r[10]=_*P+x*I+m*F+d*K,r[14]=_*E+x*B+m*Y+d*et,r[3]=M*A+v*S+g*R+y*q,r[7]=M*T+v*D+g*O+y*Z,r[11]=M*P+v*I+g*F+y*K,r[15]=M*E+v*B+g*Y+y*et,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],f=t[6],u=t[10],p=t[14],_=t[3],x=t[7],m=t[11],d=t[15];return _*(+r*c*f-s*l*f-r*o*u+n*l*u+s*o*p-n*c*p)+x*(+e*c*p-e*l*u+r*a*u-s*a*p+s*l*h-r*c*h)+m*(+e*l*f-e*o*p-r*a*f+n*a*p+r*o*h-n*l*h)+d*(-s*o*h-e*c*f+e*o*u+s*a*f-n*a*u+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=t[9],u=t[10],p=t[11],_=t[12],x=t[13],m=t[14],d=t[15],M=f*m*l-x*u*l+x*c*p-o*m*p-f*c*d+o*u*d,v=_*u*l-h*m*l-_*c*p+a*m*p+h*c*d-a*u*d,g=h*x*l-_*f*l+_*o*p-a*x*p-h*o*d+a*f*d,y=_*f*c-h*x*c-_*o*u+a*x*u+h*o*m-a*f*m,A=e*M+n*v+s*g+r*y;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/A;return t[0]=M*T,t[1]=(x*u*r-f*m*r-x*s*p+n*m*p+f*s*d-n*u*d)*T,t[2]=(o*m*r-x*c*r+x*s*l-n*m*l-o*s*d+n*c*d)*T,t[3]=(f*c*r-o*u*r-f*s*l+n*u*l+o*s*p-n*c*p)*T,t[4]=v*T,t[5]=(h*m*r-_*u*r+_*s*p-e*m*p-h*s*d+e*u*d)*T,t[6]=(_*c*r-a*m*r-_*s*l+e*m*l+a*s*d-e*c*d)*T,t[7]=(a*u*r-h*c*r+h*s*l-e*u*l-a*s*p+e*c*p)*T,t[8]=g*T,t[9]=(_*f*r-h*x*r-_*n*p+e*x*p+h*n*d-e*f*d)*T,t[10]=(a*x*r-_*o*r+_*n*l-e*x*l-a*n*d+e*o*d)*T,t[11]=(h*o*r-a*f*r-h*n*l+e*f*l+a*n*p-e*o*p)*T,t[12]=y*T,t[13]=(h*x*s-_*f*s+_*n*u-e*x*u-h*n*m+e*f*m)*T,t[14]=(_*o*s-a*x*s-_*n*c+e*x*c+a*n*m-e*o*m)*T,t[15]=(a*f*s-h*o*s+h*n*c-e*f*c-a*n*u+e*o*u)*T,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,f=o+o,u=r*l,p=r*h,_=r*f,x=a*h,m=a*f,d=o*f,M=c*l,v=c*h,g=c*f,y=n.x,A=n.y,T=n.z;return s[0]=(1-(x+d))*y,s[1]=(p+g)*y,s[2]=(_-v)*y,s[3]=0,s[4]=(p-g)*A,s[5]=(1-(u+d))*A,s[6]=(m+M)*A,s[7]=0,s[8]=(_+v)*T,s[9]=(m-M)*T,s[10]=(1-(u+x))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=mi.set(s[0],s[1],s[2]).length();const a=mi.set(s[4],s[5],s[6]).length(),o=mi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],nn.copy(this);const l=1/r,h=1/a,f=1/o;return nn.elements[0]*=l,nn.elements[1]*=l,nn.elements[2]*=l,nn.elements[4]*=h,nn.elements[5]*=h,nn.elements[6]*=h,nn.elements[8]*=f,nn.elements[9]*=f,nn.elements[10]*=f,e.setFromRotationMatrix(nn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=bn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),f=(e+t)/(e-t),u=(n+s)/(n-s);let p,_;if(o===bn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===wr)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=bn){const c=this.elements,l=1/(e-t),h=1/(n-s),f=1/(a-r),u=(e+t)*l,p=(n+s)*h;let _,x;if(o===bn)_=(a+r)*f,x=-2*f;else if(o===wr)_=r*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=x,c[14]=-_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const mi=new L,nn=new Kt,Wu=new L(0,0,0),Xu=new L(1,1,1),In=new L,Bs=new L,ze=new L,dc=new Kt,pc=new Qi;class Fr{constructor(t=0,e=0,n=0,s=Fr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],u=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Se(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Se(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Se(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Se(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Se(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return dc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(dc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return pc.setFromEuler(this),this.setFromQuaternion(pc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fr.DEFAULT_ORDER="XYZ";class ua{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Yu=0;const mc=new L,_i=new Qi,En=new Kt,zs=new L,as=new L,qu=new L,Zu=new Qi,_c=new L(1,0,0),gc=new L(0,1,0),xc=new L(0,0,1),Ku={type:"added"},$u={type:"removed"};class Ce extends ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yu++}),this.uuid=Ji(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ce.DEFAULT_UP.clone();const t=new L,e=new Fr,n=new Qi,s=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Kt},normalMatrix:{value:new Gt}}),this.matrix=new Kt,this.matrixWorld=new Kt,this.matrixAutoUpdate=Ce.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ua,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return _i.setFromAxisAngle(t,e),this.quaternion.multiply(_i),this}rotateOnWorldAxis(t,e){return _i.setFromAxisAngle(t,e),this.quaternion.premultiply(_i),this}rotateX(t){return this.rotateOnAxis(_c,t)}rotateY(t){return this.rotateOnAxis(gc,t)}rotateZ(t){return this.rotateOnAxis(xc,t)}translateOnAxis(t,e){return mc.copy(t).applyQuaternion(this.quaternion),this.position.add(mc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(_c,t)}translateY(t){return this.translateOnAxis(gc,t)}translateZ(t){return this.translateOnAxis(xc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(En.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?zs.copy(t):zs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),as.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?En.lookAt(as,zs,this.up):En.lookAt(zs,as,this.up),this.quaternion.setFromRotationMatrix(En),s&&(En.extractRotation(s.matrixWorld),_i.setFromRotationMatrix(En),this.quaternion.premultiply(_i.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Ku)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent($u)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),En.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),En.multiply(t.parent.matrixWorld)),t.applyMatrix4(En),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,t,qu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,Zu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];r(t.shapes,f)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),p=a(t.animations),_=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ce.DEFAULT_UP=new L(0,1,0);Ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new L,Mn=new L,ao=new L,Sn=new L,gi=new L,xi=new L,vc=new L,co=new L,lo=new L,ho=new L;let Hs=!1;class we{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),sn.subVectors(t,e),s.cross(sn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){sn.subVectors(s,e),Mn.subVectors(n,e),ao.subVectors(t,e);const a=sn.dot(sn),o=sn.dot(Mn),c=sn.dot(ao),l=Mn.dot(Mn),h=Mn.dot(ao),f=a*l-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,p=(l*c-o*h)*u,_=(a*h-o*c)*u;return r.set(1-p-_,_,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Sn)===null?!1:Sn.x>=0&&Sn.y>=0&&Sn.x+Sn.y<=1}static getUV(t,e,n,s,r,a,o,c){return Hs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Hs=!0),this.getInterpolation(t,e,n,s,r,a,o,c)}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,Sn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Sn.x),c.addScaledVector(a,Sn.y),c.addScaledVector(o,Sn.z),c)}static isFrontFacing(t,e,n,s){return sn.subVectors(n,e),Mn.subVectors(t,e),sn.cross(Mn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return sn.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),sn.cross(Mn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return we.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return we.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Hs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Hs=!0),we.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return we.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return we.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return we.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;gi.subVectors(s,n),xi.subVectors(r,n),co.subVectors(t,n);const c=gi.dot(co),l=xi.dot(co);if(c<=0&&l<=0)return e.copy(n);lo.subVectors(t,s);const h=gi.dot(lo),f=xi.dot(lo);if(h>=0&&f<=h)return e.copy(s);const u=c*f-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(gi,a);ho.subVectors(t,r);const p=gi.dot(ho),_=xi.dot(ho);if(_>=0&&p<=_)return e.copy(r);const x=p*l-c*_;if(x<=0&&l>=0&&_<=0)return o=l/(l-_),e.copy(n).addScaledVector(xi,o);const m=h*_-p*f;if(m<=0&&f-h>=0&&p-_>=0)return vc.subVectors(r,s),o=(f-h)/(f-h+(p-_)),e.copy(s).addScaledVector(vc,o);const d=1/(m+x+u);return a=x*d,o=u*d,e.copy(n).addScaledVector(gi,a).addScaledVector(xi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Wl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},On={h:0,s:0,l:0},Vs={h:0,s:0,l:0};function uo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Jt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Jt.workingColorSpace){if(t=la(t,1),e=Se(e,0,1),n=Se(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=uo(a,r,t+1/3),this.g=uo(a,r,t),this.b=uo(a,r,t-1/3)}return Jt.toWorkingColorSpace(this,s),this}setStyle(t,e=Me){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Me){const n=Wl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Yi(t.r),this.g=Yi(t.g),this.b=Yi(t.b),this}copyLinearToSRGB(t){return this.r=Qr(t.r),this.g=Qr(t.g),this.b=Qr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Me){return Jt.fromWorkingColorSpace(be.copy(this),t),Math.round(Se(be.r*255,0,255))*65536+Math.round(Se(be.g*255,0,255))*256+Math.round(Se(be.b*255,0,255))}getHexString(t=Me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Jt.workingColorSpace){Jt.fromWorkingColorSpace(be.copy(this),e);const n=be.r,s=be.g,r=be.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const f=a-o;switch(l=h<=.5?f/(a+o):f/(2-a-o),a){case n:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-n)/f+2;break;case r:c=(n-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Jt.workingColorSpace){return Jt.fromWorkingColorSpace(be.copy(this),e),t.r=be.r,t.g=be.g,t.b=be.b,t}getStyle(t=Me){Jt.fromWorkingColorSpace(be.copy(this),t);const e=be.r,n=be.g,s=be.b;return t!==Me?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(On),this.setHSL(On.h+t,On.s+e,On.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(On),t.getHSL(Vs);const n=Ms(On.h,Vs.h,e),s=Ms(On.s,Vs.s,e),r=Ms(On.l,Vs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const be=new qt;qt.NAMES=Wl;let ju=0;class Br extends ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=Ji(),this.name="",this.type="Material",this.blending=Xi,this.side=_n,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ho,this.blendDst=Vo,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=yr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=rc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hi,this.stencilZFail=hi,this.stencilZPass=hi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Xi&&(n.blending=this.blending),this.side!==_n&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ho&&(n.blendSrc=this.blendSrc),this.blendDst!==Vo&&(n.blendDst=this.blendDst),this.blendEquation!==ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==yr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==rc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Xl extends Br{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Rl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const fe=new L,Gs=new kt;class tn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=oc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Hn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Gs.fromBufferAttribute(this,e),Gs.applyMatrix3(t),this.setXY(e,Gs.x,Gs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix3(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix4(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyNormalMatrix(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.transformDirection(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Vi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ue(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Vi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Vi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Vi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Vi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array),r=Ue(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==oc&&(t.usage=this.usage),t}}class Yl extends tn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ql extends tn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oi extends tn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Ju=0;const Xe=new Kt,fo=new Ce,vi=new L,He=new ye,cs=new ye,ve=new L;class Rn extends ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ju++}),this.uuid=Ji(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Hl(t)?ql:Yl)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Gt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Xe.makeRotationFromQuaternion(t),this.applyMatrix4(Xe),this}rotateX(t){return Xe.makeRotationX(t),this.applyMatrix4(Xe),this}rotateY(t){return Xe.makeRotationY(t),this.applyMatrix4(Xe),this}rotateZ(t){return Xe.makeRotationZ(t),this.applyMatrix4(Xe),this}translate(t,e,n){return Xe.makeTranslation(t,e,n),this.applyMatrix4(Xe),this}scale(t,e,n){return Xe.makeScale(t,e,n),this.applyMatrix4(Xe),this}lookAt(t){return fo.lookAt(t),fo.updateMatrix(),this.applyMatrix4(fo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vi).negate(),this.translate(vi.x,vi.y,vi.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new oi(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ye);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];He.setFromBufferAttribute(r),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,He.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,He.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(He.min),this.boundingBox.expandByPoint(He.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(He.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];cs.setFromBufferAttribute(o),this.morphTargetsRelative?(ve.addVectors(He.min,cs.min),He.expandByPoint(ve),ve.addVectors(He.max,cs.max),He.expandByPoint(ve)):(He.expandByPoint(cs.min),He.expandByPoint(cs.max))}He.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)ve.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ve));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)ve.fromBufferAttribute(o,l),c&&(vi.fromBufferAttribute(t,l),ve.add(vi)),s=Math.max(s,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new tn(new Float32Array(4*o),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let S=0;S<o;S++)l[S]=new L,h[S]=new L;const f=new L,u=new L,p=new L,_=new kt,x=new kt,m=new kt,d=new L,M=new L;function v(S,D,I){f.fromArray(s,S*3),u.fromArray(s,D*3),p.fromArray(s,I*3),_.fromArray(a,S*2),x.fromArray(a,D*2),m.fromArray(a,I*2),u.sub(f),p.sub(f),x.sub(_),m.sub(_);const B=1/(x.x*m.y-m.x*x.y);isFinite(B)&&(d.copy(u).multiplyScalar(m.y).addScaledVector(p,-x.y).multiplyScalar(B),M.copy(p).multiplyScalar(x.x).addScaledVector(u,-m.x).multiplyScalar(B),l[S].add(d),l[D].add(d),l[I].add(d),h[S].add(M),h[D].add(M),h[I].add(M))}let g=this.groups;g.length===0&&(g=[{start:0,count:n.length}]);for(let S=0,D=g.length;S<D;++S){const I=g[S],B=I.start,R=I.count;for(let O=B,F=B+R;O<F;O+=3)v(n[O+0],n[O+1],n[O+2])}const y=new L,A=new L,T=new L,P=new L;function E(S){T.fromArray(r,S*3),P.copy(T);const D=l[S];y.copy(D),y.sub(T.multiplyScalar(T.dot(D))).normalize(),A.crossVectors(P,D);const B=A.dot(h[S])<0?-1:1;c[S*4]=y.x,c[S*4+1]=y.y,c[S*4+2]=y.z,c[S*4+3]=B}for(let S=0,D=g.length;S<D;++S){const I=g[S],B=I.start,R=I.count;for(let O=B,F=B+R;O<F;O+=3)E(n[O+0]),E(n[O+1]),E(n[O+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new tn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const s=new L,r=new L,a=new L,o=new L,c=new L,l=new L,h=new L,f=new L;if(t)for(let u=0,p=t.count;u<p;u+=3){const _=t.getX(u+0),x=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,m),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,_),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,p=e.count;u<p;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,f=o.normalized,u=new l.constructor(c.length*h);let p=0,_=0;for(let x=0,m=c.length;x<m;x++){o.isInterleavedBufferAttribute?p=c[x]*o.data.stride+o.offset:p=c[x]*h;for(let d=0;d<h;d++)u[_++]=l[p++]}return new tn(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Rn,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,f=l.length;h<f;h++){const u=l[h],p=t(u,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,u=l.length;f<u;f++){const p=l[f];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],f=r[l];for(let u=0,p=f.length;u<p;u++)h.push(f[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const f=a[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ec=new Kt,$n=new ha,ks=new Rs,Mc=new L,Ei=new L,Mi=new L,Si=new L,po=new L,Ws=new L,Xs=new kt,Ys=new kt,qs=new kt,Sc=new L,yc=new L,Tc=new L,Zs=new L,Ks=new L;class ln extends Ce{constructor(t=new Rn,e=new Xl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Ws.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],f=r[c];h!==0&&(po.fromBufferAttribute(f,t),a?Ws.addScaledVector(po,h):Ws.addScaledVector(po.sub(e),h))}e.add(Ws)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ks.copy(n.boundingSphere),ks.applyMatrix4(r),$n.copy(t.ray).recast(t.near),!(ks.containsPoint($n.origin)===!1&&($n.intersectSphere(ks,Mc)===null||$n.origin.distanceToSquared(Mc)>(t.far-t.near)**2))&&(Ec.copy(r).invert(),$n.copy(t.ray).applyMatrix4(Ec),!(n.boundingBox!==null&&$n.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,$n)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,x=u.length;_<x;_++){const m=u[_],d=a[m.materialIndex],M=Math.max(m.start,p.start),v=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let g=M,y=v;g<y;g+=3){const A=o.getX(g),T=o.getX(g+1),P=o.getX(g+2);s=$s(this,d,t,n,l,h,f,A,T,P),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let m=_,d=x;m<d;m+=3){const M=o.getX(m),v=o.getX(m+1),g=o.getX(m+2);s=$s(this,a,t,n,l,h,f,M,v,g),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,x=u.length;_<x;_++){const m=u[_],d=a[m.materialIndex],M=Math.max(m.start,p.start),v=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let g=M,y=v;g<y;g+=3){const A=g,T=g+1,P=g+2;s=$s(this,d,t,n,l,h,f,A,T,P),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let m=_,d=x;m<d;m+=3){const M=m,v=m+1,g=m+2;s=$s(this,a,t,n,l,h,f,M,v,g),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Qu(i,t,e,n,s,r,a,o){let c;if(t.side===Oe?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===_n,o),c===null)return null;Ks.copy(o),Ks.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ks);return l<e.near||l>e.far?null:{distance:l,point:Ks.clone(),object:i}}function $s(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,Ei),i.getVertexPosition(c,Mi),i.getVertexPosition(l,Si);const h=Qu(i,t,e,n,Ei,Mi,Si,Zs);if(h){s&&(Xs.fromBufferAttribute(s,o),Ys.fromBufferAttribute(s,c),qs.fromBufferAttribute(s,l),h.uv=we.getInterpolation(Zs,Ei,Mi,Si,Xs,Ys,qs,new kt)),r&&(Xs.fromBufferAttribute(r,o),Ys.fromBufferAttribute(r,c),qs.fromBufferAttribute(r,l),h.uv1=we.getInterpolation(Zs,Ei,Mi,Si,Xs,Ys,qs,new kt),h.uv2=h.uv1),a&&(Sc.fromBufferAttribute(a,o),yc.fromBufferAttribute(a,c),Tc.fromBufferAttribute(a,l),h.normal=we.getInterpolation(Zs,Ei,Mi,Si,Sc,yc,Tc,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new L,materialIndex:0};we.getNormal(Ei,Mi,Si,f.normal),h.face=f}return h}class ts extends Rn{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],f=[];let u=0,p=0;_("z","y","x",-1,-1,n,e,t,a,r,0),_("z","y","x",1,-1,n,e,-t,a,r,1),_("x","z","y",1,1,t,n,e,s,a,2),_("x","z","y",1,-1,t,n,-e,s,a,3),_("x","y","z",1,-1,t,e,n,s,r,4),_("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new oi(l,3)),this.setAttribute("normal",new oi(h,3)),this.setAttribute("uv",new oi(f,2));function _(x,m,d,M,v,g,y,A,T,P,E){const S=g/T,D=y/P,I=g/2,B=y/2,R=A/2,O=T+1,F=P+1;let Y=0,q=0;const Z=new L;for(let K=0;K<F;K++){const et=K*D-B;for(let nt=0;nt<O;nt++){const X=nt*S-I;Z[x]=X*M,Z[m]=et*v,Z[d]=R,l.push(Z.x,Z.y,Z.z),Z[x]=0,Z[m]=0,Z[d]=A>0?1:-1,h.push(Z.x,Z.y,Z.z),f.push(nt/T),f.push(1-K/P),Y+=1}}for(let K=0;K<P;K++)for(let et=0;et<T;et++){const nt=u+et+O*K,X=u+et+O*(K+1),$=u+(et+1)+O*(K+1),ct=u+(et+1)+O*K;c.push(nt,X,ct),c.push(X,$,ct),q+=6}o.addGroup(p,q,E),p+=q,u+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ts(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function $i(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function De(i){const t={};for(let e=0;e<i.length;e++){const n=$i(i[e]);for(const s in n)t[s]=n[s]}return t}function tf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Zl(i){return i.getRenderTarget()===null?i.outputColorSpace:Jt.workingColorSpace}const ef={clone:$i,merge:De};var nf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ci extends Br{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nf,this.fragmentShader=sf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=$i(t.uniforms),this.uniformsGroups=tf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Kl extends Ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Kt,this.projectionMatrix=new Kt,this.projectionMatrixInverse=new Kt,this.coordinateSystem=bn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Ze extends Kl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ws*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ws*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Es*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const yi=-90,Ti=1;class rf extends Ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ze(yi,Ti,t,e);s.layers=this.layers,this.add(s);const r=new Ze(yi,Ti,t,e);r.layers=this.layers,this.add(r);const a=new Ze(yi,Ti,t,e);a.layers=this.layers,this.add(a);const o=new Ze(yi,Ti,t,e);o.layers=this.layers,this.add(o);const c=new Ze(yi,Ti,t,e);c.layers=this.layers,this.add(c);const l=new Ze(yi,Ti,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===wr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,u,p),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class $l extends ke{constructor(t,e,n,s,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:qi,super(t,e,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class of extends ai{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Ss("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===ri?Me:Ke),this.texture=new $l(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:qe}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ts(5,5,5),r=new ci({name:"CubemapFromEquirect",uniforms:$i(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Oe,blending:Gn});r.uniforms.tEquirect.value=e;const a=new ln(s,r),o=e.minFilter;return e.minFilter===As&&(e.minFilter=qe),new rf(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const mo=new L,af=new L,cf=new Gt;class An{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=mo.subVectors(n,e).cross(af.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(mo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||cf.getNormalMatrix(t),s=this.coplanarPoint(mo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const jn=new Rs,js=new L;class fa{constructor(t=new An,e=new An,n=new An,s=new An,r=new An,a=new An){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=bn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],f=s[6],u=s[7],p=s[8],_=s[9],x=s[10],m=s[11],d=s[12],M=s[13],v=s[14],g=s[15];if(n[0].setComponents(c-r,u-l,m-p,g-d).normalize(),n[1].setComponents(c+r,u+l,m+p,g+d).normalize(),n[2].setComponents(c+a,u+h,m+_,g+M).normalize(),n[3].setComponents(c-a,u-h,m-_,g-M).normalize(),n[4].setComponents(c-o,u-f,m-x,g-v).normalize(),e===bn)n[5].setComponents(c+o,u+f,m+x,g+v).normalize();else if(e===wr)n[5].setComponents(o,f,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),jn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),jn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(jn)}intersectsSprite(t){return jn.center.set(0,0,0),jn.radius=.7071067811865476,jn.applyMatrix4(t.matrixWorld),this.intersectsSphere(jn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(js.x=s.normal.x>0?t.max.x:t.min.x,js.y=s.normal.y>0?t.max.y:t.min.y,js.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(js)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function jl(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function lf(i,t){const e=t.isWebGL2,n=new WeakMap;function s(l,h){const f=l.array,u=l.usage,p=f.byteLength,_=i.createBuffer();i.bindBuffer(h,_),i.bufferData(h,f,u),l.onUploadCallback();let x;if(f instanceof Float32Array)x=i.FLOAT;else if(f instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)x=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)x=i.SHORT;else if(f instanceof Uint32Array)x=i.UNSIGNED_INT;else if(f instanceof Int32Array)x=i.INT;else if(f instanceof Int8Array)x=i.BYTE;else if(f instanceof Uint8Array)x=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)x=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:_,type:x,bytesPerElement:f.BYTES_PER_ELEMENT,version:l.version,size:p}}function r(l,h,f){const u=h.array,p=h._updateRange,_=h.updateRanges;if(i.bindBuffer(f,l),p.count===-1&&_.length===0&&i.bufferSubData(f,0,u),_.length!==0){for(let x=0,m=_.length;x<m;x++){const d=_[x];e?i.bufferSubData(f,d.start*u.BYTES_PER_ELEMENT,u,d.start,d.count):i.bufferSubData(f,d.start*u.BYTES_PER_ELEMENT,u.subarray(d.start,d.start+d.count))}h.clearUpdateRanges()}p.count!==-1&&(e?i.bufferSubData(f,p.offset*u.BYTES_PER_ELEMENT,u,p.offset,p.count):i.bufferSubData(f,p.offset*u.BYTES_PER_ELEMENT,u.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const u=n.get(l);(!u||u.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const f=n.get(l);if(f===void 0)n.set(l,s(l,h));else if(f.version<l.version){if(f.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(f.buffer,l,h),f.version=l.version}}return{get:a,remove:o,update:c}}class da extends Rn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,f=t/o,u=e/c,p=[],_=[],x=[],m=[];for(let d=0;d<h;d++){const M=d*u-a;for(let v=0;v<l;v++){const g=v*f-r;_.push(g,-M,0),x.push(0,0,1),m.push(v/o),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let M=0;M<o;M++){const v=M+l*d,g=M+l*(d+1),y=M+1+l*(d+1),A=M+1+l*d;p.push(v,g,A),p.push(g,y,A)}this.setIndex(p),this.setAttribute("position",new oi(_,3)),this.setAttribute("normal",new oi(x,3)),this.setAttribute("uv",new oi(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new da(t.width,t.height,t.widthSegments,t.heightSegments)}}var hf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uf=`#ifdef USE_ALPHAHASH
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
#endif`,ff=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,df=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,mf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_f=`#ifdef USE_AOMAP
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
#endif`,gf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xf=`#ifdef USE_BATCHING
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
#endif`,vf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Ef=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,yf=`#ifdef USE_IRIDESCENCE
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
#endif`,Tf=`#ifdef USE_BUMPMAP
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
#endif`,Af=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,bf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Uf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Df=`#define PI 3.141592653589793
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
} // validated`,If=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Of=`vec3 transformedNormal = objectNormal;
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
#endif`,Nf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ff=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vf=`
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
}`,Gf=`#ifdef USE_ENVMAP
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
#endif`,kf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Wf=`#ifdef USE_ENVMAP
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
#endif`,Xf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yf=`#ifdef USE_ENVMAP
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
#endif`,qf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Kf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$f=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jf=`#ifdef USE_GRADIENTMAP
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
}`,Jf=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Qf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,td=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ed=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nd=`uniform bool receiveShadow;
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
#endif`,id=`#ifdef USE_ENVMAP
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
#endif`,sd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,od=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ad=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cd=`PhysicalMaterial material;
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
#endif`,ld=`struct PhysicalMaterial {
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
}`,hd=`
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
#endif`,ud=`#if defined( RE_IndirectDiffuse )
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
#endif`,fd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,dd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,md=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,_d=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,gd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ed=`#if defined( USE_POINTS_UV )
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
#endif`,Md=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Td=`#ifdef USE_MORPHNORMALS
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
#endif`,Ad=`#ifdef USE_MORPHTARGETS
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
#endif`,bd=`#ifdef USE_MORPHTARGETS
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
#endif`,wd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Cd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Rd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ld=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ud=`#ifdef USE_NORMALMAP
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
#endif`,Dd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Id=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Od=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,zd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Zd=`float getShadowMask() {
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
}`,Kd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$d=`#ifdef USE_SKINNING
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
#endif`,jd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jd=`#ifdef USE_SKINNING
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
#endif`,Qd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ep=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,np=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ip=`#ifdef USE_TRANSMISSION
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
#endif`,sp=`#ifdef USE_TRANSMISSION
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
#endif`,rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hp=`uniform sampler2D t2D;
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
}`,up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mp=`#include <common>
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
}`,_p=`#if DEPTH_PACKING == 3200
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
}`,gp=`#define DISTANCE
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
}`,xp=`#define DISTANCE
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
}`,vp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ep=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mp=`uniform float scale;
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
}`,Sp=`uniform vec3 diffuse;
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
}`,yp=`#include <common>
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
}`,Tp=`uniform vec3 diffuse;
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
}`,Ap=`#define LAMBERT
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
}`,bp=`#define LAMBERT
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
}`,wp=`#define MATCAP
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
}`,Cp=`#define MATCAP
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
}`,Rp=`#define NORMAL
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
}`,Pp=`#define NORMAL
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
}`,Lp=`#define PHONG
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
}`,Up=`#define PHONG
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
}`,Dp=`#define STANDARD
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
}`,Ip=`#define STANDARD
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
}`,Op=`#define TOON
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
}`,Np=`#define TOON
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
}`,Fp=`uniform float size;
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
}`,Bp=`uniform vec3 diffuse;
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
}`,zp=`#include <common>
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
}`,Hp=`uniform vec3 color;
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
}`,Vp=`uniform float rotation;
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
}`,Gp=`uniform vec3 diffuse;
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
}`,Nt={alphahash_fragment:hf,alphahash_pars_fragment:uf,alphamap_fragment:ff,alphamap_pars_fragment:df,alphatest_fragment:pf,alphatest_pars_fragment:mf,aomap_fragment:_f,aomap_pars_fragment:gf,batching_pars_vertex:xf,batching_vertex:vf,begin_vertex:Ef,beginnormal_vertex:Mf,bsdfs:Sf,iridescence_fragment:yf,bumpmap_pars_fragment:Tf,clipping_planes_fragment:Af,clipping_planes_pars_fragment:bf,clipping_planes_pars_vertex:wf,clipping_planes_vertex:Cf,color_fragment:Rf,color_pars_fragment:Pf,color_pars_vertex:Lf,color_vertex:Uf,common:Df,cube_uv_reflection_fragment:If,defaultnormal_vertex:Of,displacementmap_pars_vertex:Nf,displacementmap_vertex:Ff,emissivemap_fragment:Bf,emissivemap_pars_fragment:zf,colorspace_fragment:Hf,colorspace_pars_fragment:Vf,envmap_fragment:Gf,envmap_common_pars_fragment:kf,envmap_pars_fragment:Wf,envmap_pars_vertex:Xf,envmap_physical_pars_fragment:id,envmap_vertex:Yf,fog_vertex:qf,fog_pars_vertex:Zf,fog_fragment:Kf,fog_pars_fragment:$f,gradientmap_pars_fragment:jf,lightmap_fragment:Jf,lightmap_pars_fragment:Qf,lights_lambert_fragment:td,lights_lambert_pars_fragment:ed,lights_pars_begin:nd,lights_toon_fragment:sd,lights_toon_pars_fragment:rd,lights_phong_fragment:od,lights_phong_pars_fragment:ad,lights_physical_fragment:cd,lights_physical_pars_fragment:ld,lights_fragment_begin:hd,lights_fragment_maps:ud,lights_fragment_end:fd,logdepthbuf_fragment:dd,logdepthbuf_pars_fragment:pd,logdepthbuf_pars_vertex:md,logdepthbuf_vertex:_d,map_fragment:gd,map_pars_fragment:xd,map_particle_fragment:vd,map_particle_pars_fragment:Ed,metalnessmap_fragment:Md,metalnessmap_pars_fragment:Sd,morphcolor_vertex:yd,morphnormal_vertex:Td,morphtarget_pars_vertex:Ad,morphtarget_vertex:bd,normal_fragment_begin:wd,normal_fragment_maps:Cd,normal_pars_fragment:Rd,normal_pars_vertex:Pd,normal_vertex:Ld,normalmap_pars_fragment:Ud,clearcoat_normal_fragment_begin:Dd,clearcoat_normal_fragment_maps:Id,clearcoat_pars_fragment:Od,iridescence_pars_fragment:Nd,opaque_fragment:Fd,packing:Bd,premultiplied_alpha_fragment:zd,project_vertex:Hd,dithering_fragment:Vd,dithering_pars_fragment:Gd,roughnessmap_fragment:kd,roughnessmap_pars_fragment:Wd,shadowmap_pars_fragment:Xd,shadowmap_pars_vertex:Yd,shadowmap_vertex:qd,shadowmask_pars_fragment:Zd,skinbase_vertex:Kd,skinning_pars_vertex:$d,skinning_vertex:jd,skinnormal_vertex:Jd,specularmap_fragment:Qd,specularmap_pars_fragment:tp,tonemapping_fragment:ep,tonemapping_pars_fragment:np,transmission_fragment:ip,transmission_pars_fragment:sp,uv_pars_fragment:rp,uv_pars_vertex:op,uv_vertex:ap,worldpos_vertex:cp,background_vert:lp,background_frag:hp,backgroundCube_vert:up,backgroundCube_frag:fp,cube_vert:dp,cube_frag:pp,depth_vert:mp,depth_frag:_p,distanceRGBA_vert:gp,distanceRGBA_frag:xp,equirect_vert:vp,equirect_frag:Ep,linedashed_vert:Mp,linedashed_frag:Sp,meshbasic_vert:yp,meshbasic_frag:Tp,meshlambert_vert:Ap,meshlambert_frag:bp,meshmatcap_vert:wp,meshmatcap_frag:Cp,meshnormal_vert:Rp,meshnormal_frag:Pp,meshphong_vert:Lp,meshphong_frag:Up,meshphysical_vert:Dp,meshphysical_frag:Ip,meshtoon_vert:Op,meshtoon_frag:Np,points_vert:Fp,points_frag:Bp,shadow_vert:zp,shadow_frag:Hp,sprite_vert:Vp,sprite_frag:Gp},st={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gt},normalScale:{value:new kt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0},uvTransform:{value:new Gt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new kt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}}},pn={basic:{uniforms:De([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:De([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new qt(0)}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:De([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:De([st.common,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.roughnessmap,st.metalnessmap,st.fog,st.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:De([st.common,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.gradientmap,st.fog,st.lights,{emissive:{value:new qt(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:De([st.common,st.bumpmap,st.normalmap,st.displacementmap,st.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:De([st.points,st.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:De([st.common,st.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:De([st.common,st.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:De([st.common,st.bumpmap,st.normalmap,st.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:De([st.sprite,st.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distanceRGBA:{uniforms:De([st.common,st.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nt.distanceRGBA_vert,fragmentShader:Nt.distanceRGBA_frag},shadow:{uniforms:De([st.lights,st.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};pn.physical={uniforms:De([pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gt},clearcoatNormalScale:{value:new kt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gt},transmissionSamplerSize:{value:new kt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gt},anisotropyVector:{value:new kt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gt}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};const Js={r:0,b:0,g:0};function kp(i,t,e,n,s,r,a){const o=new qt(0);let c=r===!0?0:1,l,h,f=null,u=0,p=null;function _(m,d){let M=!1,v=d.isScene===!0?d.background:null;v&&v.isTexture&&(v=(d.backgroundBlurriness>0?e:t).get(v)),v===null?x(o,c):v&&v.isColor&&(x(v,1),M=!0);const g=i.xr.getEnvironmentBlendMode();g==="additive"?n.buffers.color.setClear(0,0,0,1,a):g==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Or)?(h===void 0&&(h=new ln(new ts(1,1,1),new ci({name:"BackgroundCubeMaterial",uniforms:$i(pn.backgroundCube.uniforms),vertexShader:pn.backgroundCube.vertexShader,fragmentShader:pn.backgroundCube.fragmentShader,side:Oe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(y,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=Jt.getTransfer(v.colorSpace)!==ie,(f!==v||u!==v.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,f=v,u=v.version,p=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ln(new da(2,2),new ci({name:"BackgroundMaterial",uniforms:$i(pn.background.uniforms),vertexShader:pn.background.vertexShader,fragmentShader:pn.background.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,l.material.toneMapped=Jt.getTransfer(v.colorSpace)!==ie,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||u!==v.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,f=v,u=v.version,p=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function x(m,d){m.getRGB(Js,Zl(i)),n.buffers.color.setClear(Js.r,Js.g,Js.b,d,a)}return{getClearColor:function(){return o},setClearColor:function(m,d=1){o.set(m),c=d,x(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,x(o,c)},render:_}}function Wp(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},c=m(null);let l=c,h=!1;function f(R,O,F,Y,q){let Z=!1;if(a){const K=x(Y,F,O);l!==K&&(l=K,p(l.object)),Z=d(R,Y,F,q),Z&&M(R,Y,F,q)}else{const K=O.wireframe===!0;(l.geometry!==Y.id||l.program!==F.id||l.wireframe!==K)&&(l.geometry=Y.id,l.program=F.id,l.wireframe=K,Z=!0)}q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(Z||h)&&(h=!1,P(R,O,F,Y),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function u(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function p(R){return n.isWebGL2?i.bindVertexArray(R):r.bindVertexArrayOES(R)}function _(R){return n.isWebGL2?i.deleteVertexArray(R):r.deleteVertexArrayOES(R)}function x(R,O,F){const Y=F.wireframe===!0;let q=o[R.id];q===void 0&&(q={},o[R.id]=q);let Z=q[O.id];Z===void 0&&(Z={},q[O.id]=Z);let K=Z[Y];return K===void 0&&(K=m(u()),Z[Y]=K),K}function m(R){const O=[],F=[],Y=[];for(let q=0;q<s;q++)O[q]=0,F[q]=0,Y[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:F,attributeDivisors:Y,object:R,attributes:{},index:null}}function d(R,O,F,Y){const q=l.attributes,Z=O.attributes;let K=0;const et=F.getAttributes();for(const nt in et)if(et[nt].location>=0){const $=q[nt];let ct=Z[nt];if(ct===void 0&&(nt==="instanceMatrix"&&R.instanceMatrix&&(ct=R.instanceMatrix),nt==="instanceColor"&&R.instanceColor&&(ct=R.instanceColor)),$===void 0||$.attribute!==ct||ct&&$.data!==ct.data)return!0;K++}return l.attributesNum!==K||l.index!==Y}function M(R,O,F,Y){const q={},Z=O.attributes;let K=0;const et=F.getAttributes();for(const nt in et)if(et[nt].location>=0){let $=Z[nt];$===void 0&&(nt==="instanceMatrix"&&R.instanceMatrix&&($=R.instanceMatrix),nt==="instanceColor"&&R.instanceColor&&($=R.instanceColor));const ct={};ct.attribute=$,$&&$.data&&(ct.data=$.data),q[nt]=ct,K++}l.attributes=q,l.attributesNum=K,l.index=Y}function v(){const R=l.newAttributes;for(let O=0,F=R.length;O<F;O++)R[O]=0}function g(R){y(R,0)}function y(R,O){const F=l.newAttributes,Y=l.enabledAttributes,q=l.attributeDivisors;F[R]=1,Y[R]===0&&(i.enableVertexAttribArray(R),Y[R]=1),q[R]!==O&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,O),q[R]=O)}function A(){const R=l.newAttributes,O=l.enabledAttributes;for(let F=0,Y=O.length;F<Y;F++)O[F]!==R[F]&&(i.disableVertexAttribArray(F),O[F]=0)}function T(R,O,F,Y,q,Z,K){K===!0?i.vertexAttribIPointer(R,O,F,q,Z):i.vertexAttribPointer(R,O,F,Y,q,Z)}function P(R,O,F,Y){if(n.isWebGL2===!1&&(R.isInstancedMesh||Y.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();const q=Y.attributes,Z=F.getAttributes(),K=O.defaultAttributeValues;for(const et in Z){const nt=Z[et];if(nt.location>=0){let X=q[et];if(X===void 0&&(et==="instanceMatrix"&&R.instanceMatrix&&(X=R.instanceMatrix),et==="instanceColor"&&R.instanceColor&&(X=R.instanceColor)),X!==void 0){const $=X.normalized,ct=X.itemSize,gt=e.get(X);if(gt===void 0)continue;const _t=gt.buffer,Lt=gt.type,It=gt.bytesPerElement,At=n.isWebGL2===!0&&(Lt===i.INT||Lt===i.UNSIGNED_INT||X.gpuType===Ll);if(X.isInterleavedBufferAttribute){const Xt=X.data,z=Xt.stride,Re=X.offset;if(Xt.isInstancedInterleavedBuffer){for(let vt=0;vt<nt.locationSize;vt++)y(nt.location+vt,Xt.meshPerAttribute);R.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=Xt.meshPerAttribute*Xt.count)}else for(let vt=0;vt<nt.locationSize;vt++)g(nt.location+vt);i.bindBuffer(i.ARRAY_BUFFER,_t);for(let vt=0;vt<nt.locationSize;vt++)T(nt.location+vt,ct/nt.locationSize,Lt,$,z*It,(Re+ct/nt.locationSize*vt)*It,At)}else{if(X.isInstancedBufferAttribute){for(let Xt=0;Xt<nt.locationSize;Xt++)y(nt.location+Xt,X.meshPerAttribute);R.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Xt=0;Xt<nt.locationSize;Xt++)g(nt.location+Xt);i.bindBuffer(i.ARRAY_BUFFER,_t);for(let Xt=0;Xt<nt.locationSize;Xt++)T(nt.location+Xt,ct/nt.locationSize,Lt,$,ct*It,ct/nt.locationSize*Xt*It,At)}}else if(K!==void 0){const $=K[et];if($!==void 0)switch($.length){case 2:i.vertexAttrib2fv(nt.location,$);break;case 3:i.vertexAttrib3fv(nt.location,$);break;case 4:i.vertexAttrib4fv(nt.location,$);break;default:i.vertexAttrib1fv(nt.location,$)}}}}A()}function E(){I();for(const R in o){const O=o[R];for(const F in O){const Y=O[F];for(const q in Y)_(Y[q].object),delete Y[q];delete O[F]}delete o[R]}}function S(R){if(o[R.id]===void 0)return;const O=o[R.id];for(const F in O){const Y=O[F];for(const q in Y)_(Y[q].object),delete Y[q];delete O[F]}delete o[R.id]}function D(R){for(const O in o){const F=o[O];if(F[R.id]===void 0)continue;const Y=F[R.id];for(const q in Y)_(Y[q].object),delete Y[q];delete F[R.id]}}function I(){B(),h=!0,l!==c&&(l=c,p(l.object))}function B(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:f,reset:I,resetDefaultState:B,dispose:E,releaseStatesOfGeometry:S,releaseStatesOfProgram:D,initAttributes:v,enableAttribute:g,disableUnusedAttributes:A}}function Xp(i,t,e,n){const s=n.isWebGL2;let r;function a(h){r=h}function o(h,f){i.drawArrays(r,h,f),e.update(f,r,1)}function c(h,f,u){if(u===0)return;let p,_;if(s)p=i,_="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),_="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[_](r,h,f,u),e.update(f,r,u)}function l(h,f,u){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<u;_++)this.render(h[_],f[_]);else{p.multiDrawArraysWEBGL(r,h,0,f,0,u);let _=0;for(let x=0;x<u;x++)_+=f[x];e.update(_,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l}function Yp(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);const l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),u=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),x=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),v=u>0,g=a||t.has("OES_texture_float"),y=v&&g,A=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:u,maxTextureSize:p,maxCubemapSize:_,maxAttributes:x,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:M,vertexTextures:v,floatFragmentTextures:g,floatVertexTextures:y,maxSamples:A}}function qp(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new An,o=new Gt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const p=f.length!==0||u||n!==0||s;return s=u,n=f.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,p){const _=f.clippingPlanes,x=f.clipIntersection,m=f.clipShadows,d=i.get(f);if(!s||_===null||_.length===0||r&&!m)r?h(null):l();else{const M=r?0:n,v=M*4;let g=d.clippingState||null;c.value=g,g=h(_,u,v,p);for(let y=0;y!==v;++y)g[y]=e[y];d.clippingState=g,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,p,_){const x=f!==null?f.length:0;let m=null;if(x!==0){if(m=c.value,_!==!0||m===null){const d=p+x*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<d)&&(m=new Float32Array(d));for(let v=0,g=p;v!==x;++v,g+=4)a.copy(f[v]).applyMatrix4(M,o),a.normal.toArray(m,g),m[g+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function Zp(i){let t=new WeakMap;function e(a,o){return o===Go?a.mapping=qi:o===ko&&(a.mapping=Zi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Go||o===ko)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new of(c.height/2);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Jl extends Kl{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Gi=4,Ac=[.125,.215,.35,.446,.526,.582],ni=20,_o=new Jl,bc=new qt;let go=null,xo=0,vo=0;const ti=(1+Math.sqrt(5))/2,Ai=1/ti,wc=[new L(1,1,1),new L(-1,1,1),new L(1,1,-1),new L(-1,1,-1),new L(0,ti,Ai),new L(0,ti,-Ai),new L(Ai,0,ti),new L(-Ai,0,ti),new L(ti,Ai,0),new L(-ti,Ai,0)];class Cc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){go=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),vo=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Lc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(go,xo,vo),t.scissorTest=!1,Qs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===qi||t.mapping===Zi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),go=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),vo=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:qe,minFilter:qe,generateMipmaps:!1,type:bs,format:cn,colorSpace:Cn,depthBuffer:!1},s=Rc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Kp(r)),this._blurMaterial=$p(r,t,e)}return s}_compileMaterial(t){const e=new ln(this._lodPlanes[0],t);this._renderer.compile(e,_o)}_sceneToCubeUV(t,e,n,s){const o=new Ze(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(bc),h.toneMapping=kn,h.autoClear=!1;const p=new Xl({name:"PMREM.Background",side:Oe,depthWrite:!1,depthTest:!1}),_=new ln(new ts,p);let x=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,x=!0):(p.color.copy(bc),x=!0);for(let d=0;d<6;d++){const M=d%3;M===0?(o.up.set(0,c[d],0),o.lookAt(l[d],0,0)):M===1?(o.up.set(0,0,c[d]),o.lookAt(0,l[d],0)):(o.up.set(0,c[d],0),o.lookAt(0,0,l[d]));const v=this._cubeSize;Qs(s,M*v,d>2?v:0,v,v),h.setRenderTarget(s),x&&h.render(_,o),h.render(t,o)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=u,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===qi||t.mapping===Zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Lc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ln(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;Qs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,_o)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=wc[(s-1)%wc.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ln(this._lodPlanes[s],l),u=l.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ni-1),x=r/_,m=isFinite(r)?1+Math.floor(h*x):ni;m>ni&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ni}`);const d=[];let M=0;for(let T=0;T<ni;++T){const P=T/x,E=Math.exp(-P*P/2);d.push(E),T===0?M+=E:T<m&&(M+=2*E)}for(let T=0;T<d.length;T++)d[T]=d[T]/M;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=d,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:v}=this;u.dTheta.value=_,u.mipInt.value=v-n;const g=this._sizeLods[s],y=3*g*(s>v-Gi?s-v+Gi:0),A=4*(this._cubeSize-g);Qs(e,y,A,3*g,2*g),c.setRenderTarget(e),c.render(f,_o)}}function Kp(i){const t=[],e=[],n=[];let s=i;const r=i-Gi+1+Ac.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-Gi?c=Ac[a-i+Gi-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,f=1+l,u=[h,h,f,h,f,f,h,h,f,f,h,f],p=6,_=6,x=3,m=2,d=1,M=new Float32Array(x*_*p),v=new Float32Array(m*_*p),g=new Float32Array(d*_*p);for(let A=0;A<p;A++){const T=A%3*2/3-1,P=A>2?0:-1,E=[T,P,0,T+2/3,P,0,T+2/3,P+1,0,T,P,0,T+2/3,P+1,0,T,P+1,0];M.set(E,x*_*A),v.set(u,m*_*A);const S=[A,A,A,A,A,A];g.set(S,d*_*A)}const y=new Rn;y.setAttribute("position",new tn(M,x)),y.setAttribute("uv",new tn(v,m)),y.setAttribute("faceIndex",new tn(g,d)),t.push(y),s>Gi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Rc(i,t,e){const n=new ai(i,t,e);return n.texture.mapping=Or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Qs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function $p(i,t,e){const n=new Float32Array(ni),s=new L(0,1,0);return new ci({name:"SphericalGaussianBlur",defines:{n:ni,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:pa(),fragmentShader:`

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
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Pc(){return new ci({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pa(),fragmentShader:`

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
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Lc(){return new ci({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function pa(){return`

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
	`}function jp(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Go||c===ko,h=c===qi||c===Zi;if(l||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=t.get(o);return e===null&&(e=new Cc(i)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),t.set(o,f),f.texture}else{if(t.has(o))return t.get(o).texture;{const f=o.image;if(l&&f&&f.height>0||h&&f&&s(f)){e===null&&(e=new Cc(i));const u=l?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,u),o.addEventListener("dispose",r),u.texture}else return null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Jp(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Qp(i,t,e,n){const s={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const _ in u.attributes)t.remove(u.attributes[_]);for(const _ in u.morphAttributes){const x=u.morphAttributes[_];for(let m=0,d=x.length;m<d;m++)t.remove(x[m])}u.removeEventListener("dispose",a),delete s[u.id];const p=r.get(u);p&&(t.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function c(f){const u=f.attributes;for(const _ in u)t.update(u[_],i.ARRAY_BUFFER);const p=f.morphAttributes;for(const _ in p){const x=p[_];for(let m=0,d=x.length;m<d;m++)t.update(x[m],i.ARRAY_BUFFER)}}function l(f){const u=[],p=f.index,_=f.attributes.position;let x=0;if(p!==null){const M=p.array;x=p.version;for(let v=0,g=M.length;v<g;v+=3){const y=M[v+0],A=M[v+1],T=M[v+2];u.push(y,A,A,T,T,y)}}else if(_!==void 0){const M=_.array;x=_.version;for(let v=0,g=M.length/3-1;v<g;v+=3){const y=v+0,A=v+1,T=v+2;u.push(y,A,A,T,T,y)}}else return;const m=new(Hl(u)?ql:Yl)(u,1);m.version=x;const d=r.get(f);d&&t.remove(d),r.set(f,m)}function h(f){const u=r.get(f);if(u){const p=f.index;p!==null&&u.version<p.version&&l(f)}else l(f);return r.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function tm(i,t,e,n){const s=n.isWebGL2;let r;function a(p){r=p}let o,c;function l(p){o=p.type,c=p.bytesPerElement}function h(p,_){i.drawElements(r,_,o,p*c),e.update(_,r,1)}function f(p,_,x){if(x===0)return;let m,d;if(s)m=i,d="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](r,_,o,p*c,x),e.update(_,r,x)}function u(p,_,x){if(x===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<x;d++)this.render(p[d]/c,_[d]);else{m.multiDrawElementsWEBGL(r,_,0,o,p,0,x);let d=0;for(let M=0;M<x;M++)d+=_[M];e.update(d,r,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=f,this.renderMultiDraw=u}function em(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function nm(i,t){return i[0]-t[0]}function im(i,t){return Math.abs(t[1])-Math.abs(i[1])}function sm(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,a=new pe,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,h,f){const u=l.morphTargetInfluences;if(t.isWebGL2===!0){const _=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,x=_!==void 0?_.length:0;let m=r.get(h);if(m===void 0||m.count!==x){let O=function(){B.dispose(),r.delete(h),h.removeEventListener("dispose",O)};var p=O;m!==void 0&&m.texture.dispose();const v=h.morphAttributes.position!==void 0,g=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,A=h.morphAttributes.position||[],T=h.morphAttributes.normal||[],P=h.morphAttributes.color||[];let E=0;v===!0&&(E=1),g===!0&&(E=2),y===!0&&(E=3);let S=h.attributes.position.count*E,D=1;S>t.maxTextureSize&&(D=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const I=new Float32Array(S*D*4*x),B=new kl(I,S,D,x);B.type=Hn,B.needsUpdate=!0;const R=E*4;for(let F=0;F<x;F++){const Y=A[F],q=T[F],Z=P[F],K=S*D*4*F;for(let et=0;et<Y.count;et++){const nt=et*R;v===!0&&(a.fromBufferAttribute(Y,et),I[K+nt+0]=a.x,I[K+nt+1]=a.y,I[K+nt+2]=a.z,I[K+nt+3]=0),g===!0&&(a.fromBufferAttribute(q,et),I[K+nt+4]=a.x,I[K+nt+5]=a.y,I[K+nt+6]=a.z,I[K+nt+7]=0),y===!0&&(a.fromBufferAttribute(Z,et),I[K+nt+8]=a.x,I[K+nt+9]=a.y,I[K+nt+10]=a.z,I[K+nt+11]=Z.itemSize===4?a.w:1)}}m={count:x,texture:B,size:new kt(S,D)},r.set(h,m),h.addEventListener("dispose",O)}let d=0;for(let v=0;v<u.length;v++)d+=u[v];const M=h.morphTargetsRelative?1:1-d;f.getUniforms().setValue(i,"morphTargetBaseInfluence",M),f.getUniforms().setValue(i,"morphTargetInfluences",u),f.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),f.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const _=u===void 0?0:u.length;let x=n[h.id];if(x===void 0||x.length!==_){x=[];for(let g=0;g<_;g++)x[g]=[g,0];n[h.id]=x}for(let g=0;g<_;g++){const y=x[g];y[0]=g,y[1]=u[g]}x.sort(im);for(let g=0;g<8;g++)g<_&&x[g][1]?(o[g][0]=x[g][0],o[g][1]=x[g][1]):(o[g][0]=Number.MAX_SAFE_INTEGER,o[g][1]=0);o.sort(nm);const m=h.morphAttributes.position,d=h.morphAttributes.normal;let M=0;for(let g=0;g<8;g++){const y=o[g],A=y[0],T=y[1];A!==Number.MAX_SAFE_INTEGER&&T?(m&&h.getAttribute("morphTarget"+g)!==m[A]&&h.setAttribute("morphTarget"+g,m[A]),d&&h.getAttribute("morphNormal"+g)!==d[A]&&h.setAttribute("morphNormal"+g,d[A]),s[g]=T,M+=T):(m&&h.hasAttribute("morphTarget"+g)===!0&&h.deleteAttribute("morphTarget"+g),d&&h.hasAttribute("morphNormal"+g)===!0&&h.deleteAttribute("morphNormal"+g),s[g]=0)}const v=h.morphTargetsRelative?1:1-M;f.getUniforms().setValue(i,"morphTargetBaseInfluence",v),f.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function rm(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,f=t.get(c,h);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==l&&(u.update(),s.set(u,l))}return f}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}class Ql extends ke{constructor(t,e,n,s,r,a,o,c,l,h){if(h=h!==void 0?h:si,h!==si&&h!==Ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===si&&(n=zn),n===void 0&&h===Ki&&(n=ii),super(null,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Ie,this.minFilter=c!==void 0?c:Ie,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const th=new ke,eh=new Ql(1,1);eh.compareFunction=zl;const nh=new kl,ih=new Gu,sh=new $l,Uc=[],Dc=[],Ic=new Float32Array(16),Oc=new Float32Array(9),Nc=new Float32Array(4);function es(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Uc[s];if(r===void 0&&(r=new Float32Array(s),Uc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function me(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function _e(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function zr(i,t){let e=Dc[t];e===void 0&&(e=new Int32Array(t),Dc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function om(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function am(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2fv(this.addr,t),_e(e,t)}}function cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(me(e,t))return;i.uniform3fv(this.addr,t),_e(e,t)}}function lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4fv(this.addr,t),_e(e,t)}}function hm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),_e(e,t)}else{if(me(e,n))return;Nc.set(n),i.uniformMatrix2fv(this.addr,!1,Nc),_e(e,n)}}function um(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),_e(e,t)}else{if(me(e,n))return;Oc.set(n),i.uniformMatrix3fv(this.addr,!1,Oc),_e(e,n)}}function fm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),_e(e,t)}else{if(me(e,n))return;Ic.set(n),i.uniformMatrix4fv(this.addr,!1,Ic),_e(e,n)}}function dm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function pm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2iv(this.addr,t),_e(e,t)}}function mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3iv(this.addr,t),_e(e,t)}}function _m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4iv(this.addr,t),_e(e,t)}}function gm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2uiv(this.addr,t),_e(e,t)}}function vm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3uiv(this.addr,t),_e(e,t)}}function Em(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4uiv(this.addr,t),_e(e,t)}}function Mm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?eh:th;e.setTexture2D(t||r,s)}function Sm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ih,s)}function ym(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||sh,s)}function Tm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||nh,s)}function Am(i){switch(i){case 5126:return om;case 35664:return am;case 35665:return cm;case 35666:return lm;case 35674:return hm;case 35675:return um;case 35676:return fm;case 5124:case 35670:return dm;case 35667:case 35671:return pm;case 35668:case 35672:return mm;case 35669:case 35673:return _m;case 5125:return gm;case 36294:return xm;case 36295:return vm;case 36296:return Em;case 35678:case 36198:case 36298:case 36306:case 35682:return Mm;case 35679:case 36299:case 36307:return Sm;case 35680:case 36300:case 36308:case 36293:return ym;case 36289:case 36303:case 36311:case 36292:return Tm}}function bm(i,t){i.uniform1fv(this.addr,t)}function wm(i,t){const e=es(t,this.size,2);i.uniform2fv(this.addr,e)}function Cm(i,t){const e=es(t,this.size,3);i.uniform3fv(this.addr,e)}function Rm(i,t){const e=es(t,this.size,4);i.uniform4fv(this.addr,e)}function Pm(i,t){const e=es(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Lm(i,t){const e=es(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Um(i,t){const e=es(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Dm(i,t){i.uniform1iv(this.addr,t)}function Im(i,t){i.uniform2iv(this.addr,t)}function Om(i,t){i.uniform3iv(this.addr,t)}function Nm(i,t){i.uniform4iv(this.addr,t)}function Fm(i,t){i.uniform1uiv(this.addr,t)}function Bm(i,t){i.uniform2uiv(this.addr,t)}function zm(i,t){i.uniform3uiv(this.addr,t)}function Hm(i,t){i.uniform4uiv(this.addr,t)}function Vm(i,t,e){const n=this.cache,s=t.length,r=zr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),_e(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||th,r[a])}function Gm(i,t,e){const n=this.cache,s=t.length,r=zr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),_e(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||ih,r[a])}function km(i,t,e){const n=this.cache,s=t.length,r=zr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),_e(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||sh,r[a])}function Wm(i,t,e){const n=this.cache,s=t.length,r=zr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),_e(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||nh,r[a])}function Xm(i){switch(i){case 5126:return bm;case 35664:return wm;case 35665:return Cm;case 35666:return Rm;case 35674:return Pm;case 35675:return Lm;case 35676:return Um;case 5124:case 35670:return Dm;case 35667:case 35671:return Im;case 35668:case 35672:return Om;case 35669:case 35673:return Nm;case 5125:return Fm;case 36294:return Bm;case 36295:return zm;case 36296:return Hm;case 35678:case 36198:case 36298:case 36306:case 35682:return Vm;case 35679:case 36299:case 36307:return Gm;case 35680:case 36300:case 36308:case 36293:return km;case 36289:case 36303:case 36311:case 36292:return Wm}}class Ym{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Am(e.type)}}class qm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Xm(e.type)}}class Zm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Eo=/(\w+)(\])?(\[|\.)?/g;function Fc(i,t){i.seq.push(t),i.map[t.id]=t}function Km(i,t,e){const n=i.name,s=n.length;for(Eo.lastIndex=0;;){const r=Eo.exec(n),a=Eo.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Fc(e,l===void 0?new Ym(o,i,t):new qm(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Zm(o),Fc(e,f)),e=f}}}class Mr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Km(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Bc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const $m=37297;let jm=0;function Jm(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function Qm(i){const t=Jt.getPrimaries(Jt.workingColorSpace),e=Jt.getPrimaries(i);let n;switch(t===e?n="":t===br&&e===Ar?n="LinearDisplayP3ToLinearSRGB":t===Ar&&e===br&&(n="LinearSRGBToLinearDisplayP3"),i){case Cn:case Nr:return[n,"LinearTransferOETF"];case Me:case ca:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function zc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Jm(i.getShaderSource(t),a)}else return s}function t_(i,t){const e=Qm(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function e_(i,t){let e;switch(t){case $h:e="Linear";break;case jh:e="Reinhard";break;case Jh:e="OptimizedCineon";break;case Qh:e="ACESFilmic";break;case eu:e="AgX";break;case tu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function n_(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ki).join(`
`)}function i_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(ki).join(`
`)}function s_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function r_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function ki(i){return i!==""}function Hc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Vc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const o_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zo(i){return i.replace(o_,c_)}const a_=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function c_(i,t){let e=Nt[t];if(e===void 0){const n=a_.get(t);if(n!==void 0)e=Nt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Zo(e)}const l_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gc(i){return i.replace(l_,h_)}function h_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function kc(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function u_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Cl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Th?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===yn&&(t="SHADOWMAP_TYPE_VSM"),t}function f_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case qi:case Zi:t="ENVMAP_TYPE_CUBE";break;case Or:t="ENVMAP_TYPE_CUBE_UV";break}return t}function d_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Zi:t="ENVMAP_MODE_REFRACTION";break}return t}function p_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Rl:t="ENVMAP_BLENDING_MULTIPLY";break;case Zh:t="ENVMAP_BLENDING_MIX";break;case Kh:t="ENVMAP_BLENDING_ADD";break}return t}function m_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function __(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=u_(e),l=f_(e),h=d_(e),f=p_(e),u=m_(e),p=e.isWebGL2?"":n_(e),_=i_(e),x=s_(r),m=s.createProgram();let d,M,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(ki).join(`
`),d.length>0&&(d+=`
`),M=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(ki).join(`
`),M.length>0&&(M+=`
`)):(d=[kc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ki).join(`
`),M=[p,kc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==kn?"#define TONE_MAPPING":"",e.toneMapping!==kn?Nt.tonemapping_pars_fragment:"",e.toneMapping!==kn?e_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,t_("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ki).join(`
`)),a=Zo(a),a=Hc(a,e),a=Vc(a,e),o=Zo(o),o=Hc(o,e),o=Vc(o,e),a=Gc(a),o=Gc(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,d=[_,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,M=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===ac?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ac?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);const g=v+d+a,y=v+M+o,A=Bc(s,s.VERTEX_SHADER,g),T=Bc(s,s.FRAGMENT_SHADER,y);s.attachShader(m,A),s.attachShader(m,T),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function P(I){if(i.debug.checkShaderErrors){const B=s.getProgramInfoLog(m).trim(),R=s.getShaderInfoLog(A).trim(),O=s.getShaderInfoLog(T).trim();let F=!0,Y=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(F=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,A,T);else{const q=zc(s,A,"vertex"),Z=zc(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+B+`
`+q+`
`+Z)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(R===""||O==="")&&(Y=!1);Y&&(I.diagnostics={runnable:F,programLog:B,vertexShader:{log:R,prefix:d},fragmentShader:{log:O,prefix:M}})}s.deleteShader(A),s.deleteShader(T),E=new Mr(s,m),S=r_(s,m)}let E;this.getUniforms=function(){return E===void 0&&P(this),E};let S;this.getAttributes=function(){return S===void 0&&P(this),S};let D=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=s.getProgramParameter(m,$m)),D},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=jm++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=A,this.fragmentShader=T,this}let g_=0;class x_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new v_(t),e.set(t,n)),n}}class v_{constructor(t){this.id=g_++,this.code=t,this.usedTimes=0}}function E_(i,t,e,n,s,r,a){const o=new ua,c=new x_,l=[],h=s.isWebGL2,f=s.logarithmicDepthBuffer,u=s.vertexTextures;let p=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(E){return E===0?"uv":`uv${E}`}function m(E,S,D,I,B){const R=I.fog,O=B.geometry,F=E.isMeshStandardMaterial?I.environment:null,Y=(E.isMeshStandardMaterial?e:t).get(E.envMap||F),q=Y&&Y.mapping===Or?Y.image.height:null,Z=_[E.type];E.precision!==null&&(p=s.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const K=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,et=K!==void 0?K.length:0;let nt=0;O.morphAttributes.position!==void 0&&(nt=1),O.morphAttributes.normal!==void 0&&(nt=2),O.morphAttributes.color!==void 0&&(nt=3);let X,$,ct,gt;if(Z){const Pe=pn[Z];X=Pe.vertexShader,$=Pe.fragmentShader}else X=E.vertexShader,$=E.fragmentShader,c.update(E),ct=c.getVertexShaderID(E),gt=c.getFragmentShaderID(E);const _t=i.getRenderTarget(),Lt=B.isInstancedMesh===!0,It=B.isBatchedMesh===!0,At=!!E.map,Xt=!!E.matcap,z=!!Y,Re=!!E.aoMap,vt=!!E.lightMap,Rt=!!E.bumpMap,dt=!!E.normalMap,re=!!E.displacementMap,Ft=!!E.emissiveMap,C=!!E.metalnessMap,b=!!E.roughnessMap,V=E.anisotropy>0,Q=E.clearcoat>0,J=E.iridescence>0,tt=E.sheen>0,pt=E.transmission>0,at=V&&!!E.anisotropyMap,ut=Q&&!!E.clearcoatMap,yt=Q&&!!E.clearcoatNormalMap,Bt=Q&&!!E.clearcoatRoughnessMap,j=J&&!!E.iridescenceMap,jt=J&&!!E.iridescenceThicknessMap,Wt=tt&&!!E.sheenColorMap,Ct=tt&&!!E.sheenRoughnessMap,xt=!!E.specularMap,ft=!!E.specularColorMap,Ot=!!E.specularIntensityMap,$t=pt&&!!E.transmissionMap,ce=pt&&!!E.thicknessMap,Ht=!!E.gradientMap,it=!!E.alphaMap,U=E.alphaTest>0,rt=!!E.alphaHash,ot=!!E.extensions,bt=!!O.attributes.uv1,Et=!!O.attributes.uv2,Qt=!!O.attributes.uv3;let te=kn;return E.toneMapped&&(_t===null||_t.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:h,shaderID:Z,shaderType:E.type,shaderName:E.name,vertexShader:X,fragmentShader:$,defines:E.defines,customVertexShaderID:ct,customFragmentShaderID:gt,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:It,instancing:Lt,instancingColor:Lt&&B.instanceColor!==null,supportsVertexTextures:u,outputColorSpace:_t===null?i.outputColorSpace:_t.isXRRenderTarget===!0?_t.texture.colorSpace:Cn,map:At,matcap:Xt,envMap:z,envMapMode:z&&Y.mapping,envMapCubeUVHeight:q,aoMap:Re,lightMap:vt,bumpMap:Rt,normalMap:dt,displacementMap:u&&re,emissiveMap:Ft,normalMapObjectSpace:dt&&E.normalMapType===pu,normalMapTangentSpace:dt&&E.normalMapType===du,metalnessMap:C,roughnessMap:b,anisotropy:V,anisotropyMap:at,clearcoat:Q,clearcoatMap:ut,clearcoatNormalMap:yt,clearcoatRoughnessMap:Bt,iridescence:J,iridescenceMap:j,iridescenceThicknessMap:jt,sheen:tt,sheenColorMap:Wt,sheenRoughnessMap:Ct,specularMap:xt,specularColorMap:ft,specularIntensityMap:Ot,transmission:pt,transmissionMap:$t,thicknessMap:ce,gradientMap:Ht,opaque:E.transparent===!1&&E.blending===Xi,alphaMap:it,alphaTest:U,alphaHash:rt,combine:E.combine,mapUv:At&&x(E.map.channel),aoMapUv:Re&&x(E.aoMap.channel),lightMapUv:vt&&x(E.lightMap.channel),bumpMapUv:Rt&&x(E.bumpMap.channel),normalMapUv:dt&&x(E.normalMap.channel),displacementMapUv:re&&x(E.displacementMap.channel),emissiveMapUv:Ft&&x(E.emissiveMap.channel),metalnessMapUv:C&&x(E.metalnessMap.channel),roughnessMapUv:b&&x(E.roughnessMap.channel),anisotropyMapUv:at&&x(E.anisotropyMap.channel),clearcoatMapUv:ut&&x(E.clearcoatMap.channel),clearcoatNormalMapUv:yt&&x(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Bt&&x(E.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&x(E.iridescenceMap.channel),iridescenceThicknessMapUv:jt&&x(E.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&x(E.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&x(E.sheenRoughnessMap.channel),specularMapUv:xt&&x(E.specularMap.channel),specularColorMapUv:ft&&x(E.specularColorMap.channel),specularIntensityMapUv:Ot&&x(E.specularIntensityMap.channel),transmissionMapUv:$t&&x(E.transmissionMap.channel),thicknessMapUv:ce&&x(E.thicknessMap.channel),alphaMapUv:it&&x(E.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(dt||V),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,vertexUv1s:bt,vertexUv2s:Et,vertexUv3s:Qt,pointsUvs:B.isPoints===!0&&!!O.attributes.uv&&(At||it),fog:!!R,useFog:E.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:B.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:et,morphTextureStride:nt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:At&&E.map.isVideoTexture===!0&&Jt.getTransfer(E.map.colorSpace)===ie,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===mn,flipSided:E.side===Oe,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionDerivatives:ot&&E.extensions.derivatives===!0,extensionFragDepth:ot&&E.extensions.fragDepth===!0,extensionDrawBuffers:ot&&E.extensions.drawBuffers===!0,extensionShaderTextureLOD:ot&&E.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ot&&E.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()}}function d(E){const S=[];if(E.shaderID?S.push(E.shaderID):(S.push(E.customVertexShaderID),S.push(E.customFragmentShaderID)),E.defines!==void 0)for(const D in E.defines)S.push(D),S.push(E.defines[D]);return E.isRawShaderMaterial===!1&&(M(S,E),v(S,E),S.push(i.outputColorSpace)),S.push(E.customProgramCacheKey),S.join()}function M(E,S){E.push(S.precision),E.push(S.outputColorSpace),E.push(S.envMapMode),E.push(S.envMapCubeUVHeight),E.push(S.mapUv),E.push(S.alphaMapUv),E.push(S.lightMapUv),E.push(S.aoMapUv),E.push(S.bumpMapUv),E.push(S.normalMapUv),E.push(S.displacementMapUv),E.push(S.emissiveMapUv),E.push(S.metalnessMapUv),E.push(S.roughnessMapUv),E.push(S.anisotropyMapUv),E.push(S.clearcoatMapUv),E.push(S.clearcoatNormalMapUv),E.push(S.clearcoatRoughnessMapUv),E.push(S.iridescenceMapUv),E.push(S.iridescenceThicknessMapUv),E.push(S.sheenColorMapUv),E.push(S.sheenRoughnessMapUv),E.push(S.specularMapUv),E.push(S.specularColorMapUv),E.push(S.specularIntensityMapUv),E.push(S.transmissionMapUv),E.push(S.thicknessMapUv),E.push(S.combine),E.push(S.fogExp2),E.push(S.sizeAttenuation),E.push(S.morphTargetsCount),E.push(S.morphAttributeCount),E.push(S.numDirLights),E.push(S.numPointLights),E.push(S.numSpotLights),E.push(S.numSpotLightMaps),E.push(S.numHemiLights),E.push(S.numRectAreaLights),E.push(S.numDirLightShadows),E.push(S.numPointLightShadows),E.push(S.numSpotLightShadows),E.push(S.numSpotLightShadowsWithMaps),E.push(S.numLightProbes),E.push(S.shadowMapType),E.push(S.toneMapping),E.push(S.numClippingPlanes),E.push(S.numClipIntersection),E.push(S.depthPacking)}function v(E,S){o.disableAll(),S.isWebGL2&&o.enable(0),S.supportsVertexTextures&&o.enable(1),S.instancing&&o.enable(2),S.instancingColor&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),E.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.skinning&&o.enable(4),S.morphTargets&&o.enable(5),S.morphNormals&&o.enable(6),S.morphColors&&o.enable(7),S.premultipliedAlpha&&o.enable(8),S.shadowMapEnabled&&o.enable(9),S.useLegacyLights&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),E.push(o.mask)}function g(E){const S=_[E.type];let D;if(S){const I=pn[S];D=ef.clone(I.uniforms)}else D=E.uniforms;return D}function y(E,S){let D;for(let I=0,B=l.length;I<B;I++){const R=l[I];if(R.cacheKey===S){D=R,++D.usedTimes;break}}return D===void 0&&(D=new __(i,S,E,r),l.push(D)),D}function A(E){if(--E.usedTimes===0){const S=l.indexOf(E);l[S]=l[l.length-1],l.pop(),E.destroy()}}function T(E){c.remove(E)}function P(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:g,acquireProgram:y,releaseProgram:A,releaseShaderCache:T,programs:l,dispose:P}}function M_(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function S_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Wc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Xc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(f,u,p,_,x,m){let d=i[t];return d===void 0?(d={id:f.id,object:f,geometry:u,material:p,groupOrder:_,renderOrder:f.renderOrder,z:x,group:m},i[t]=d):(d.id=f.id,d.object=f,d.geometry=u,d.material=p,d.groupOrder=_,d.renderOrder=f.renderOrder,d.z=x,d.group=m),t++,d}function o(f,u,p,_,x,m){const d=a(f,u,p,_,x,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):e.push(d)}function c(f,u,p,_,x,m){const d=a(f,u,p,_,x,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function l(f,u){e.length>1&&e.sort(f||S_),n.length>1&&n.sort(u||Wc),s.length>1&&s.sort(u||Wc)}function h(){for(let f=t,u=i.length;f<u;f++){const p=i[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function y_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Xc,i.set(n,[a])):s>=r.length?(a=new Xc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function T_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new qt};break;case"SpotLight":e={position:new L,direction:new L,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function A_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let b_=0;function w_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function C_(i,t){const e=new T_,n=A_(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new L);const r=new L,a=new Kt,o=new Kt;function c(h,f){let u=0,p=0,_=0;for(let I=0;I<9;I++)s.probe[I].set(0,0,0);let x=0,m=0,d=0,M=0,v=0,g=0,y=0,A=0,T=0,P=0,E=0;h.sort(w_);const S=f===!0?Math.PI:1;for(let I=0,B=h.length;I<B;I++){const R=h[I],O=R.color,F=R.intensity,Y=R.distance,q=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=O.r*F*S,p+=O.g*F*S,_+=O.b*F*S;else if(R.isLightProbe){for(let Z=0;Z<9;Z++)s.probe[Z].addScaledVector(R.sh.coefficients[Z],F);E++}else if(R.isDirectionalLight){const Z=e.get(R);if(Z.color.copy(R.color).multiplyScalar(R.intensity*S),R.castShadow){const K=R.shadow,et=n.get(R);et.shadowBias=K.bias,et.shadowNormalBias=K.normalBias,et.shadowRadius=K.radius,et.shadowMapSize=K.mapSize,s.directionalShadow[x]=et,s.directionalShadowMap[x]=q,s.directionalShadowMatrix[x]=R.shadow.matrix,g++}s.directional[x]=Z,x++}else if(R.isSpotLight){const Z=e.get(R);Z.position.setFromMatrixPosition(R.matrixWorld),Z.color.copy(O).multiplyScalar(F*S),Z.distance=Y,Z.coneCos=Math.cos(R.angle),Z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),Z.decay=R.decay,s.spot[d]=Z;const K=R.shadow;if(R.map&&(s.spotLightMap[T]=R.map,T++,K.updateMatrices(R),R.castShadow&&P++),s.spotLightMatrix[d]=K.matrix,R.castShadow){const et=n.get(R);et.shadowBias=K.bias,et.shadowNormalBias=K.normalBias,et.shadowRadius=K.radius,et.shadowMapSize=K.mapSize,s.spotShadow[d]=et,s.spotShadowMap[d]=q,A++}d++}else if(R.isRectAreaLight){const Z=e.get(R);Z.color.copy(O).multiplyScalar(F),Z.halfWidth.set(R.width*.5,0,0),Z.halfHeight.set(0,R.height*.5,0),s.rectArea[M]=Z,M++}else if(R.isPointLight){const Z=e.get(R);if(Z.color.copy(R.color).multiplyScalar(R.intensity*S),Z.distance=R.distance,Z.decay=R.decay,R.castShadow){const K=R.shadow,et=n.get(R);et.shadowBias=K.bias,et.shadowNormalBias=K.normalBias,et.shadowRadius=K.radius,et.shadowMapSize=K.mapSize,et.shadowCameraNear=K.camera.near,et.shadowCameraFar=K.camera.far,s.pointShadow[m]=et,s.pointShadowMap[m]=q,s.pointShadowMatrix[m]=R.shadow.matrix,y++}s.point[m]=Z,m++}else if(R.isHemisphereLight){const Z=e.get(R);Z.skyColor.copy(R.color).multiplyScalar(F*S),Z.groundColor.copy(R.groundColor).multiplyScalar(F*S),s.hemi[v]=Z,v++}}M>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=st.LTC_FLOAT_1,s.rectAreaLTC2=st.LTC_FLOAT_2):(s.rectAreaLTC1=st.LTC_HALF_1,s.rectAreaLTC2=st.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=st.LTC_FLOAT_1,s.rectAreaLTC2=st.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=st.LTC_HALF_1,s.rectAreaLTC2=st.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=u,s.ambient[1]=p,s.ambient[2]=_;const D=s.hash;(D.directionalLength!==x||D.pointLength!==m||D.spotLength!==d||D.rectAreaLength!==M||D.hemiLength!==v||D.numDirectionalShadows!==g||D.numPointShadows!==y||D.numSpotShadows!==A||D.numSpotMaps!==T||D.numLightProbes!==E)&&(s.directional.length=x,s.spot.length=d,s.rectArea.length=M,s.point.length=m,s.hemi.length=v,s.directionalShadow.length=g,s.directionalShadowMap.length=g,s.pointShadow.length=y,s.pointShadowMap.length=y,s.spotShadow.length=A,s.spotShadowMap.length=A,s.directionalShadowMatrix.length=g,s.pointShadowMatrix.length=y,s.spotLightMatrix.length=A+T-P,s.spotLightMap.length=T,s.numSpotLightShadowsWithMaps=P,s.numLightProbes=E,D.directionalLength=x,D.pointLength=m,D.spotLength=d,D.rectAreaLength=M,D.hemiLength=v,D.numDirectionalShadows=g,D.numPointShadows=y,D.numSpotShadows=A,D.numSpotMaps=T,D.numLightProbes=E,s.version=b_++)}function l(h,f){let u=0,p=0,_=0,x=0,m=0;const d=f.matrixWorldInverse;for(let M=0,v=h.length;M<v;M++){const g=h[M];if(g.isDirectionalLight){const y=s.directional[u];y.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(d),u++}else if(g.isSpotLight){const y=s.spot[_];y.position.setFromMatrixPosition(g.matrixWorld),y.position.applyMatrix4(d),y.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(d),_++}else if(g.isRectAreaLight){const y=s.rectArea[x];y.position.setFromMatrixPosition(g.matrixWorld),y.position.applyMatrix4(d),o.identity(),a.copy(g.matrixWorld),a.premultiply(d),o.extractRotation(a),y.halfWidth.set(g.width*.5,0,0),y.halfHeight.set(0,g.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),x++}else if(g.isPointLight){const y=s.point[p];y.position.setFromMatrixPosition(g.matrixWorld),y.position.applyMatrix4(d),p++}else if(g.isHemisphereLight){const y=s.hemi[m];y.direction.setFromMatrixPosition(g.matrixWorld),y.direction.transformDirection(d),m++}}}return{setup:c,setupView:l,state:s}}function Yc(i,t){const e=new C_(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(f){n.push(f)}function o(f){s.push(f)}function c(f){e.setup(n,f)}function l(f){e.setupView(n,f)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function R_(i,t){let e=new WeakMap;function n(r,a=0){const o=e.get(r);let c;return o===void 0?(c=new Yc(i,t),e.set(r,[c])):a>=o.length?(c=new Yc(i,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class P_ extends Br{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=uu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class L_ extends Br{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const U_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D_=`uniform sampler2D shadow_pass;
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
}`;function I_(i,t,e){let n=new fa;const s=new kt,r=new kt,a=new pe,o=new P_({depthPacking:fu}),c=new L_,l={},h=e.maxTextureSize,f={[_n]:Oe,[Oe]:_n,[mn]:mn},u=new ci({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new kt},radius:{value:4}},vertexShader:U_,fragmentShader:D_}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const _=new Rn;_.setAttribute("position",new tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ln(_,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Cl;let d=this.type;this.render=function(A,T,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const E=i.getRenderTarget(),S=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),I=i.state;I.setBlending(Gn),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const B=d!==yn&&this.type===yn,R=d===yn&&this.type!==yn;for(let O=0,F=A.length;O<F;O++){const Y=A[O],q=Y.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);const Z=q.getFrameExtents();if(s.multiply(Z),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Z.x),s.x=r.x*Z.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Z.y),s.y=r.y*Z.y,q.mapSize.y=r.y)),q.map===null||B===!0||R===!0){const et=this.type!==yn?{minFilter:Ie,magFilter:Ie}:{};q.map!==null&&q.map.dispose(),q.map=new ai(s.x,s.y,et),q.map.texture.name=Y.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();const K=q.getViewportCount();for(let et=0;et<K;et++){const nt=q.getViewport(et);a.set(r.x*nt.x,r.y*nt.y,r.x*nt.z,r.y*nt.w),I.viewport(a),q.updateMatrices(Y,et),n=q.getFrustum(),g(T,P,q.camera,Y,this.type)}q.isPointLightShadow!==!0&&this.type===yn&&M(q,P),q.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(E,S,D)};function M(A,T){const P=t.update(x);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ai(s.x,s.y)),u.uniforms.shadow_pass.value=A.map.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(T,null,P,u,x,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(T,null,P,p,x,null)}function v(A,T,P,E){let S=null;const D=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)S=D;else if(S=P.isPointLight===!0?c:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const I=S.uuid,B=T.uuid;let R=l[I];R===void 0&&(R={},l[I]=R);let O=R[B];O===void 0&&(O=S.clone(),R[B]=O,T.addEventListener("dispose",y)),S=O}if(S.visible=T.visible,S.wireframe=T.wireframe,E===yn?S.side=T.shadowSide!==null?T.shadowSide:T.side:S.side=T.shadowSide!==null?T.shadowSide:f[T.side],S.alphaMap=T.alphaMap,S.alphaTest=T.alphaTest,S.map=T.map,S.clipShadows=T.clipShadows,S.clippingPlanes=T.clippingPlanes,S.clipIntersection=T.clipIntersection,S.displacementMap=T.displacementMap,S.displacementScale=T.displacementScale,S.displacementBias=T.displacementBias,S.wireframeLinewidth=T.wireframeLinewidth,S.linewidth=T.linewidth,P.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const I=i.properties.get(S);I.light=P}return S}function g(A,T,P,E,S){if(A.visible===!1)return;if(A.layers.test(T.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&S===yn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);const B=t.update(A),R=A.material;if(Array.isArray(R)){const O=B.groups;for(let F=0,Y=O.length;F<Y;F++){const q=O[F],Z=R[q.materialIndex];if(Z&&Z.visible){const K=v(A,Z,E,S);A.onBeforeShadow(i,A,T,P,B,K,q),i.renderBufferDirect(P,null,B,K,A,q),A.onAfterShadow(i,A,T,P,B,K,q)}}}else if(R.visible){const O=v(A,R,E,S);A.onBeforeShadow(i,A,T,P,B,O,null),i.renderBufferDirect(P,null,B,O,A,null),A.onAfterShadow(i,A,T,P,B,O,null)}}const I=A.children;for(let B=0,R=I.length;B<R;B++)g(I[B],T,P,E,S)}function y(A){A.target.removeEventListener("dispose",y);for(const P in l){const E=l[P],S=A.target.uuid;S in E&&(E[S].dispose(),delete E[S])}}}function O_(i,t,e){const n=e.isWebGL2;function s(){let U=!1;const rt=new pe;let ot=null;const bt=new pe(0,0,0,0);return{setMask:function(Et){ot!==Et&&!U&&(i.colorMask(Et,Et,Et,Et),ot=Et)},setLocked:function(Et){U=Et},setClear:function(Et,Qt,te,ge,Pe){Pe===!0&&(Et*=ge,Qt*=ge,te*=ge),rt.set(Et,Qt,te,ge),bt.equals(rt)===!1&&(i.clearColor(Et,Qt,te,ge),bt.copy(rt))},reset:function(){U=!1,ot=null,bt.set(-1,0,0,0)}}}function r(){let U=!1,rt=null,ot=null,bt=null;return{setTest:function(Et){Et?It(i.DEPTH_TEST):At(i.DEPTH_TEST)},setMask:function(Et){rt!==Et&&!U&&(i.depthMask(Et),rt=Et)},setFunc:function(Et){if(ot!==Et){switch(Et){case Vh:i.depthFunc(i.NEVER);break;case Gh:i.depthFunc(i.ALWAYS);break;case kh:i.depthFunc(i.LESS);break;case yr:i.depthFunc(i.LEQUAL);break;case Wh:i.depthFunc(i.EQUAL);break;case Xh:i.depthFunc(i.GEQUAL);break;case Yh:i.depthFunc(i.GREATER);break;case qh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ot=Et}},setLocked:function(Et){U=Et},setClear:function(Et){bt!==Et&&(i.clearDepth(Et),bt=Et)},reset:function(){U=!1,rt=null,ot=null,bt=null}}}function a(){let U=!1,rt=null,ot=null,bt=null,Et=null,Qt=null,te=null,ge=null,Pe=null;return{setTest:function(ee){U||(ee?It(i.STENCIL_TEST):At(i.STENCIL_TEST))},setMask:function(ee){rt!==ee&&!U&&(i.stencilMask(ee),rt=ee)},setFunc:function(ee,Le,un){(ot!==ee||bt!==Le||Et!==un)&&(i.stencilFunc(ee,Le,un),ot=ee,bt=Le,Et=un)},setOp:function(ee,Le,un){(Qt!==ee||te!==Le||ge!==un)&&(i.stencilOp(ee,Le,un),Qt=ee,te=Le,ge=un)},setLocked:function(ee){U=ee},setClear:function(ee){Pe!==ee&&(i.clearStencil(ee),Pe=ee)},reset:function(){U=!1,rt=null,ot=null,bt=null,Et=null,Qt=null,te=null,ge=null,Pe=null}}}const o=new s,c=new r,l=new a,h=new WeakMap,f=new WeakMap;let u={},p={},_=new WeakMap,x=[],m=null,d=!1,M=null,v=null,g=null,y=null,A=null,T=null,P=null,E=new qt(0,0,0),S=0,D=!1,I=null,B=null,R=null,O=null,F=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,Z=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(K)[1]),q=Z>=1):K.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),q=Z>=2);let et=null,nt={};const X=i.getParameter(i.SCISSOR_BOX),$=i.getParameter(i.VIEWPORT),ct=new pe().fromArray(X),gt=new pe().fromArray($);function _t(U,rt,ot,bt){const Et=new Uint8Array(4),Qt=i.createTexture();i.bindTexture(U,Qt),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<ot;te++)n&&(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)?i.texImage3D(rt,0,i.RGBA,1,1,bt,0,i.RGBA,i.UNSIGNED_BYTE,Et):i.texImage2D(rt+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Et);return Qt}const Lt={};Lt[i.TEXTURE_2D]=_t(i.TEXTURE_2D,i.TEXTURE_2D,1),Lt[i.TEXTURE_CUBE_MAP]=_t(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Lt[i.TEXTURE_2D_ARRAY]=_t(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Lt[i.TEXTURE_3D]=_t(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),It(i.DEPTH_TEST),c.setFunc(yr),Ft(!1),C(wa),It(i.CULL_FACE),dt(Gn);function It(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function At(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function Xt(U,rt){return p[U]!==rt?(i.bindFramebuffer(U,rt),p[U]=rt,n&&(U===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=rt),U===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=rt)),!0):!1}function z(U,rt){let ot=x,bt=!1;if(U)if(ot=_.get(rt),ot===void 0&&(ot=[],_.set(rt,ot)),U.isWebGLMultipleRenderTargets){const Et=U.texture;if(ot.length!==Et.length||ot[0]!==i.COLOR_ATTACHMENT0){for(let Qt=0,te=Et.length;Qt<te;Qt++)ot[Qt]=i.COLOR_ATTACHMENT0+Qt;ot.length=Et.length,bt=!0}}else ot[0]!==i.COLOR_ATTACHMENT0&&(ot[0]=i.COLOR_ATTACHMENT0,bt=!0);else ot[0]!==i.BACK&&(ot[0]=i.BACK,bt=!0);bt&&(e.isWebGL2?i.drawBuffers(ot):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ot))}function Re(U){return m!==U?(i.useProgram(U),m=U,!0):!1}const vt={[ei]:i.FUNC_ADD,[bh]:i.FUNC_SUBTRACT,[wh]:i.FUNC_REVERSE_SUBTRACT};if(n)vt[La]=i.MIN,vt[Ua]=i.MAX;else{const U=t.get("EXT_blend_minmax");U!==null&&(vt[La]=U.MIN_EXT,vt[Ua]=U.MAX_EXT)}const Rt={[Ch]:i.ZERO,[Rh]:i.ONE,[Ph]:i.SRC_COLOR,[Ho]:i.SRC_ALPHA,[Nh]:i.SRC_ALPHA_SATURATE,[Ih]:i.DST_COLOR,[Uh]:i.DST_ALPHA,[Lh]:i.ONE_MINUS_SRC_COLOR,[Vo]:i.ONE_MINUS_SRC_ALPHA,[Oh]:i.ONE_MINUS_DST_COLOR,[Dh]:i.ONE_MINUS_DST_ALPHA,[Fh]:i.CONSTANT_COLOR,[Bh]:i.ONE_MINUS_CONSTANT_COLOR,[zh]:i.CONSTANT_ALPHA,[Hh]:i.ONE_MINUS_CONSTANT_ALPHA};function dt(U,rt,ot,bt,Et,Qt,te,ge,Pe,ee){if(U===Gn){d===!0&&(At(i.BLEND),d=!1);return}if(d===!1&&(It(i.BLEND),d=!0),U!==Ah){if(U!==M||ee!==D){if((v!==ei||A!==ei)&&(i.blendEquation(i.FUNC_ADD),v=ei,A=ei),ee)switch(U){case Xi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ca:i.blendFunc(i.ONE,i.ONE);break;case Ra:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Xi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ca:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ra:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}g=null,y=null,T=null,P=null,E.set(0,0,0),S=0,M=U,D=ee}return}Et=Et||rt,Qt=Qt||ot,te=te||bt,(rt!==v||Et!==A)&&(i.blendEquationSeparate(vt[rt],vt[Et]),v=rt,A=Et),(ot!==g||bt!==y||Qt!==T||te!==P)&&(i.blendFuncSeparate(Rt[ot],Rt[bt],Rt[Qt],Rt[te]),g=ot,y=bt,T=Qt,P=te),(ge.equals(E)===!1||Pe!==S)&&(i.blendColor(ge.r,ge.g,ge.b,Pe),E.copy(ge),S=Pe),M=U,D=!1}function re(U,rt){U.side===mn?At(i.CULL_FACE):It(i.CULL_FACE);let ot=U.side===Oe;rt&&(ot=!ot),Ft(ot),U.blending===Xi&&U.transparent===!1?dt(Gn):dt(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),c.setFunc(U.depthFunc),c.setTest(U.depthTest),c.setMask(U.depthWrite),o.setMask(U.colorWrite);const bt=U.stencilWrite;l.setTest(bt),bt&&(l.setMask(U.stencilWriteMask),l.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),l.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),V(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?It(i.SAMPLE_ALPHA_TO_COVERAGE):At(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ft(U){I!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),I=U)}function C(U){U!==Sh?(It(i.CULL_FACE),U!==B&&(U===wa?i.cullFace(i.BACK):U===yh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):At(i.CULL_FACE),B=U}function b(U){U!==R&&(q&&i.lineWidth(U),R=U)}function V(U,rt,ot){U?(It(i.POLYGON_OFFSET_FILL),(O!==rt||F!==ot)&&(i.polygonOffset(rt,ot),O=rt,F=ot)):At(i.POLYGON_OFFSET_FILL)}function Q(U){U?It(i.SCISSOR_TEST):At(i.SCISSOR_TEST)}function J(U){U===void 0&&(U=i.TEXTURE0+Y-1),et!==U&&(i.activeTexture(U),et=U)}function tt(U,rt,ot){ot===void 0&&(et===null?ot=i.TEXTURE0+Y-1:ot=et);let bt=nt[ot];bt===void 0&&(bt={type:void 0,texture:void 0},nt[ot]=bt),(bt.type!==U||bt.texture!==rt)&&(et!==ot&&(i.activeTexture(ot),et=ot),i.bindTexture(U,rt||Lt[U]),bt.type=U,bt.texture=rt)}function pt(){const U=nt[et];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function at(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ut(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function yt(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Bt(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function jt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Wt(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ct(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function xt(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ft(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ot(U){ct.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),ct.copy(U))}function $t(U){gt.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),gt.copy(U))}function ce(U,rt){let ot=f.get(rt);ot===void 0&&(ot=new WeakMap,f.set(rt,ot));let bt=ot.get(U);bt===void 0&&(bt=i.getUniformBlockIndex(rt,U.name),ot.set(U,bt))}function Ht(U,rt){const bt=f.get(rt).get(U);h.get(rt)!==bt&&(i.uniformBlockBinding(rt,bt,U.__bindingPointIndex),h.set(rt,bt))}function it(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},et=null,nt={},p={},_=new WeakMap,x=[],m=null,d=!1,M=null,v=null,g=null,y=null,A=null,T=null,P=null,E=new qt(0,0,0),S=0,D=!1,I=null,B=null,R=null,O=null,F=null,ct.set(0,0,i.canvas.width,i.canvas.height),gt.set(0,0,i.canvas.width,i.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:It,disable:At,bindFramebuffer:Xt,drawBuffers:z,useProgram:Re,setBlending:dt,setMaterial:re,setFlipSided:Ft,setCullFace:C,setLineWidth:b,setPolygonOffset:V,setScissorTest:Q,activeTexture:J,bindTexture:tt,unbindTexture:pt,compressedTexImage2D:at,compressedTexImage3D:ut,texImage2D:xt,texImage3D:ft,updateUBOMapping:ce,uniformBlockBinding:Ht,texStorage2D:Wt,texStorage3D:Ct,texSubImage2D:yt,texSubImage3D:Bt,compressedTexSubImage2D:j,compressedTexSubImage3D:jt,scissor:Ot,viewport:$t,reset:it}}function N_(i,t,e,n,s,r,a){const o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let f;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,b){return p?new OffscreenCanvas(C,b):Rr("canvas")}function x(C,b,V,Q){let J=1;if((C.width>Q||C.height>Q)&&(J=Q/Math.max(C.width,C.height)),J<1||b===!0)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap){const tt=b?Cr:Math.floor,pt=tt(J*C.width),at=tt(J*C.height);f===void 0&&(f=_(pt,at));const ut=V?_(pt,at):f;return ut.width=pt,ut.height=at,ut.getContext("2d").drawImage(C,0,0,pt,at),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+C.width+"x"+C.height+") to ("+pt+"x"+at+")."),ut}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+C.width+"x"+C.height+")."),C;return C}function m(C){return qo(C.width)&&qo(C.height)}function d(C){return o?!1:C.wrapS!==an||C.wrapT!==an||C.minFilter!==Ie&&C.minFilter!==qe}function M(C,b){return C.generateMipmaps&&b&&C.minFilter!==Ie&&C.minFilter!==qe}function v(C){i.generateMipmap(C)}function g(C,b,V,Q,J=!1){if(o===!1)return b;if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let tt=b;if(b===i.RED&&(V===i.FLOAT&&(tt=i.R32F),V===i.HALF_FLOAT&&(tt=i.R16F),V===i.UNSIGNED_BYTE&&(tt=i.R8)),b===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(tt=i.R8UI),V===i.UNSIGNED_SHORT&&(tt=i.R16UI),V===i.UNSIGNED_INT&&(tt=i.R32UI),V===i.BYTE&&(tt=i.R8I),V===i.SHORT&&(tt=i.R16I),V===i.INT&&(tt=i.R32I)),b===i.RG&&(V===i.FLOAT&&(tt=i.RG32F),V===i.HALF_FLOAT&&(tt=i.RG16F),V===i.UNSIGNED_BYTE&&(tt=i.RG8)),b===i.RGBA){const pt=J?Tr:Jt.getTransfer(Q);V===i.FLOAT&&(tt=i.RGBA32F),V===i.HALF_FLOAT&&(tt=i.RGBA16F),V===i.UNSIGNED_BYTE&&(tt=pt===ie?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(tt=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(tt=i.RGB5_A1)}return(tt===i.R16F||tt===i.R32F||tt===i.RG16F||tt===i.RG32F||tt===i.RGBA16F||tt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function y(C,b,V){return M(C,V)===!0||C.isFramebufferTexture&&C.minFilter!==Ie&&C.minFilter!==qe?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function A(C){return C===Ie||C===Da||C===Yr?i.NEAREST:i.LINEAR}function T(C){const b=C.target;b.removeEventListener("dispose",T),E(b),b.isVideoTexture&&h.delete(b)}function P(C){const b=C.target;b.removeEventListener("dispose",P),D(b)}function E(C){const b=n.get(C);if(b.__webglInit===void 0)return;const V=C.source,Q=u.get(V);if(Q){const J=Q[b.__cacheKey];J.usedTimes--,J.usedTimes===0&&S(C),Object.keys(Q).length===0&&u.delete(V)}n.remove(C)}function S(C){const b=n.get(C);i.deleteTexture(b.__webglTexture);const V=C.source,Q=u.get(V);delete Q[b.__cacheKey],a.memory.textures--}function D(C){const b=C.texture,V=n.get(C),Q=n.get(b);if(Q.__webglTexture!==void 0&&(i.deleteTexture(Q.__webglTexture),a.memory.textures--),C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(V.__webglFramebuffer[J]))for(let tt=0;tt<V.__webglFramebuffer[J].length;tt++)i.deleteFramebuffer(V.__webglFramebuffer[J][tt]);else i.deleteFramebuffer(V.__webglFramebuffer[J]);V.__webglDepthbuffer&&i.deleteRenderbuffer(V.__webglDepthbuffer[J])}else{if(Array.isArray(V.__webglFramebuffer))for(let J=0;J<V.__webglFramebuffer.length;J++)i.deleteFramebuffer(V.__webglFramebuffer[J]);else i.deleteFramebuffer(V.__webglFramebuffer);if(V.__webglDepthbuffer&&i.deleteRenderbuffer(V.__webglDepthbuffer),V.__webglMultisampledFramebuffer&&i.deleteFramebuffer(V.__webglMultisampledFramebuffer),V.__webglColorRenderbuffer)for(let J=0;J<V.__webglColorRenderbuffer.length;J++)V.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(V.__webglColorRenderbuffer[J]);V.__webglDepthRenderbuffer&&i.deleteRenderbuffer(V.__webglDepthRenderbuffer)}if(C.isWebGLMultipleRenderTargets)for(let J=0,tt=b.length;J<tt;J++){const pt=n.get(b[J]);pt.__webglTexture&&(i.deleteTexture(pt.__webglTexture),a.memory.textures--),n.remove(b[J])}n.remove(b),n.remove(C)}let I=0;function B(){I=0}function R(){const C=I;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),I+=1,C}function O(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function F(C,b){const V=n.get(C);if(C.isVideoTexture&&re(C),C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){const Q=C.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ct(V,C,b);return}}e.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+b)}function Y(C,b){const V=n.get(C);if(C.version>0&&V.__version!==C.version){ct(V,C,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+b)}function q(C,b){const V=n.get(C);if(C.version>0&&V.__version!==C.version){ct(V,C,b);return}e.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+b)}function Z(C,b){const V=n.get(C);if(C.version>0&&V.__version!==C.version){gt(V,C,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+b)}const K={[Wo]:i.REPEAT,[an]:i.CLAMP_TO_EDGE,[Xo]:i.MIRRORED_REPEAT},et={[Ie]:i.NEAREST,[Da]:i.NEAREST_MIPMAP_NEAREST,[Yr]:i.NEAREST_MIPMAP_LINEAR,[qe]:i.LINEAR,[nu]:i.LINEAR_MIPMAP_NEAREST,[As]:i.LINEAR_MIPMAP_LINEAR},nt={[mu]:i.NEVER,[Mu]:i.ALWAYS,[_u]:i.LESS,[zl]:i.LEQUAL,[gu]:i.EQUAL,[Eu]:i.GEQUAL,[xu]:i.GREATER,[vu]:i.NOTEQUAL};function X(C,b,V){if(V?(i.texParameteri(C,i.TEXTURE_WRAP_S,K[b.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,K[b.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,K[b.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,et[b.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,et[b.minFilter])):(i.texParameteri(C,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(C,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(b.wrapS!==an||b.wrapT!==an)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(C,i.TEXTURE_MAG_FILTER,A(b.magFilter)),i.texParameteri(C,i.TEXTURE_MIN_FILTER,A(b.minFilter)),b.minFilter!==Ie&&b.minFilter!==qe&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,nt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const Q=t.get("EXT_texture_filter_anisotropic");if(b.magFilter===Ie||b.minFilter!==Yr&&b.minFilter!==As||b.type===Hn&&t.has("OES_texture_float_linear")===!1||o===!1&&b.type===bs&&t.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||n.get(b).__currentAnisotropy)&&(i.texParameterf(C,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy)}}function $(C,b){let V=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",T));const Q=b.source;let J=u.get(Q);J===void 0&&(J={},u.set(Q,J));const tt=O(b);if(tt!==C.__cacheKey){J[tt]===void 0&&(J[tt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,V=!0),J[tt].usedTimes++;const pt=J[C.__cacheKey];pt!==void 0&&(J[C.__cacheKey].usedTimes--,pt.usedTimes===0&&S(b)),C.__cacheKey=tt,C.__webglTexture=J[tt].texture}return V}function ct(C,b,V){let Q=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Q=i.TEXTURE_3D);const J=$(C,b),tt=b.source;e.bindTexture(Q,C.__webglTexture,i.TEXTURE0+V);const pt=n.get(tt);if(tt.version!==pt.__version||J===!0){e.activeTexture(i.TEXTURE0+V);const at=Jt.getPrimaries(Jt.workingColorSpace),ut=b.colorSpace===Ke?null:Jt.getPrimaries(b.colorSpace),yt=b.colorSpace===Ke||at===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const Bt=d(b)&&m(b.image)===!1;let j=x(b.image,Bt,!1,s.maxTextureSize);j=Ft(b,j);const jt=m(j)||o,Wt=r.convert(b.format,b.colorSpace);let Ct=r.convert(b.type),xt=g(b.internalFormat,Wt,Ct,b.colorSpace,b.isVideoTexture);X(Q,b,jt);let ft;const Ot=b.mipmaps,$t=o&&b.isVideoTexture!==!0&&xt!==Fl,ce=pt.__version===void 0||J===!0,Ht=y(b,j,jt);if(b.isDepthTexture)xt=i.DEPTH_COMPONENT,o?b.type===Hn?xt=i.DEPTH_COMPONENT32F:b.type===zn?xt=i.DEPTH_COMPONENT24:b.type===ii?xt=i.DEPTH24_STENCIL8:xt=i.DEPTH_COMPONENT16:b.type===Hn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===si&&xt===i.DEPTH_COMPONENT&&b.type!==aa&&b.type!==zn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=zn,Ct=r.convert(b.type)),b.format===Ki&&xt===i.DEPTH_COMPONENT&&(xt=i.DEPTH_STENCIL,b.type!==ii&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=ii,Ct=r.convert(b.type))),ce&&($t?e.texStorage2D(i.TEXTURE_2D,1,xt,j.width,j.height):e.texImage2D(i.TEXTURE_2D,0,xt,j.width,j.height,0,Wt,Ct,null));else if(b.isDataTexture)if(Ot.length>0&&jt){$t&&ce&&e.texStorage2D(i.TEXTURE_2D,Ht,xt,Ot[0].width,Ot[0].height);for(let it=0,U=Ot.length;it<U;it++)ft=Ot[it],$t?e.texSubImage2D(i.TEXTURE_2D,it,0,0,ft.width,ft.height,Wt,Ct,ft.data):e.texImage2D(i.TEXTURE_2D,it,xt,ft.width,ft.height,0,Wt,Ct,ft.data);b.generateMipmaps=!1}else $t?(ce&&e.texStorage2D(i.TEXTURE_2D,Ht,xt,j.width,j.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,j.width,j.height,Wt,Ct,j.data)):e.texImage2D(i.TEXTURE_2D,0,xt,j.width,j.height,0,Wt,Ct,j.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){$t&&ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ht,xt,Ot[0].width,Ot[0].height,j.depth);for(let it=0,U=Ot.length;it<U;it++)ft=Ot[it],b.format!==cn?Wt!==null?$t?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,ft.width,ft.height,j.depth,Wt,ft.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,xt,ft.width,ft.height,j.depth,0,ft.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):$t?e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,ft.width,ft.height,j.depth,Wt,Ct,ft.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,xt,ft.width,ft.height,j.depth,0,Wt,Ct,ft.data)}else{$t&&ce&&e.texStorage2D(i.TEXTURE_2D,Ht,xt,Ot[0].width,Ot[0].height);for(let it=0,U=Ot.length;it<U;it++)ft=Ot[it],b.format!==cn?Wt!==null?$t?e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,ft.width,ft.height,Wt,ft.data):e.compressedTexImage2D(i.TEXTURE_2D,it,xt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):$t?e.texSubImage2D(i.TEXTURE_2D,it,0,0,ft.width,ft.height,Wt,Ct,ft.data):e.texImage2D(i.TEXTURE_2D,it,xt,ft.width,ft.height,0,Wt,Ct,ft.data)}else if(b.isDataArrayTexture)$t?(ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ht,xt,j.width,j.height,j.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,Wt,Ct,j.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,xt,j.width,j.height,j.depth,0,Wt,Ct,j.data);else if(b.isData3DTexture)$t?(ce&&e.texStorage3D(i.TEXTURE_3D,Ht,xt,j.width,j.height,j.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,Wt,Ct,j.data)):e.texImage3D(i.TEXTURE_3D,0,xt,j.width,j.height,j.depth,0,Wt,Ct,j.data);else if(b.isFramebufferTexture){if(ce)if($t)e.texStorage2D(i.TEXTURE_2D,Ht,xt,j.width,j.height);else{let it=j.width,U=j.height;for(let rt=0;rt<Ht;rt++)e.texImage2D(i.TEXTURE_2D,rt,xt,it,U,0,Wt,Ct,null),it>>=1,U>>=1}}else if(Ot.length>0&&jt){$t&&ce&&e.texStorage2D(i.TEXTURE_2D,Ht,xt,Ot[0].width,Ot[0].height);for(let it=0,U=Ot.length;it<U;it++)ft=Ot[it],$t?e.texSubImage2D(i.TEXTURE_2D,it,0,0,Wt,Ct,ft):e.texImage2D(i.TEXTURE_2D,it,xt,Wt,Ct,ft);b.generateMipmaps=!1}else $t?(ce&&e.texStorage2D(i.TEXTURE_2D,Ht,xt,j.width,j.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Wt,Ct,j)):e.texImage2D(i.TEXTURE_2D,0,xt,Wt,Ct,j);M(b,jt)&&v(Q),pt.__version=tt.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function gt(C,b,V){if(b.image.length!==6)return;const Q=$(C,b),J=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+V);const tt=n.get(J);if(J.version!==tt.__version||Q===!0){e.activeTexture(i.TEXTURE0+V);const pt=Jt.getPrimaries(Jt.workingColorSpace),at=b.colorSpace===Ke?null:Jt.getPrimaries(b.colorSpace),ut=b.colorSpace===Ke||pt===at?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const yt=b.isCompressedTexture||b.image[0].isCompressedTexture,Bt=b.image[0]&&b.image[0].isDataTexture,j=[];for(let it=0;it<6;it++)!yt&&!Bt?j[it]=x(b.image[it],!1,!0,s.maxCubemapSize):j[it]=Bt?b.image[it].image:b.image[it],j[it]=Ft(b,j[it]);const jt=j[0],Wt=m(jt)||o,Ct=r.convert(b.format,b.colorSpace),xt=r.convert(b.type),ft=g(b.internalFormat,Ct,xt,b.colorSpace),Ot=o&&b.isVideoTexture!==!0,$t=tt.__version===void 0||Q===!0;let ce=y(b,jt,Wt);X(i.TEXTURE_CUBE_MAP,b,Wt);let Ht;if(yt){Ot&&$t&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ce,ft,jt.width,jt.height);for(let it=0;it<6;it++){Ht=j[it].mipmaps;for(let U=0;U<Ht.length;U++){const rt=Ht[U];b.format!==cn?Ct!==null?Ot?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,U,0,0,rt.width,rt.height,Ct,rt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,U,ft,rt.width,rt.height,0,rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,U,0,0,rt.width,rt.height,Ct,xt,rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,U,ft,rt.width,rt.height,0,Ct,xt,rt.data)}}}else{Ht=b.mipmaps,Ot&&$t&&(Ht.length>0&&ce++,e.texStorage2D(i.TEXTURE_CUBE_MAP,ce,ft,j[0].width,j[0].height));for(let it=0;it<6;it++)if(Bt){Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,j[it].width,j[it].height,Ct,xt,j[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ft,j[it].width,j[it].height,0,Ct,xt,j[it].data);for(let U=0;U<Ht.length;U++){const ot=Ht[U].image[it].image;Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,U+1,0,0,ot.width,ot.height,Ct,xt,ot.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,U+1,ft,ot.width,ot.height,0,Ct,xt,ot.data)}}else{Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Ct,xt,j[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ft,Ct,xt,j[it]);for(let U=0;U<Ht.length;U++){const rt=Ht[U];Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,U+1,0,0,Ct,xt,rt.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,U+1,ft,Ct,xt,rt.image[it])}}}M(b,Wt)&&v(i.TEXTURE_CUBE_MAP),tt.__version=J.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function _t(C,b,V,Q,J,tt){const pt=r.convert(V.format,V.colorSpace),at=r.convert(V.type),ut=g(V.internalFormat,pt,at,V.colorSpace);if(!n.get(b).__hasExternalTextures){const Bt=Math.max(1,b.width>>tt),j=Math.max(1,b.height>>tt);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,tt,ut,Bt,j,b.depth,0,pt,at,null):e.texImage2D(J,tt,ut,Bt,j,0,pt,at,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),dt(b)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,J,n.get(V).__webglTexture,0,Rt(b)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,J,n.get(V).__webglTexture,tt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Lt(C,b,V){if(i.bindRenderbuffer(i.RENDERBUFFER,C),b.depthBuffer&&!b.stencilBuffer){let Q=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(V||dt(b)){const J=b.depthTexture;J&&J.isDepthTexture&&(J.type===Hn?Q=i.DEPTH_COMPONENT32F:J.type===zn&&(Q=i.DEPTH_COMPONENT24));const tt=Rt(b);dt(b)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,tt,Q,b.width,b.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,tt,Q,b.width,b.height)}else i.renderbufferStorage(i.RENDERBUFFER,Q,b.width,b.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,C)}else if(b.depthBuffer&&b.stencilBuffer){const Q=Rt(b);V&&dt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,i.DEPTH24_STENCIL8,b.width,b.height):dt(b)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Q,i.DEPTH24_STENCIL8,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,C)}else{const Q=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let J=0;J<Q.length;J++){const tt=Q[J],pt=r.convert(tt.format,tt.colorSpace),at=r.convert(tt.type),ut=g(tt.internalFormat,pt,at,tt.colorSpace),yt=Rt(b);V&&dt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,yt,ut,b.width,b.height):dt(b)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,yt,ut,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,ut,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function It(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),F(b.depthTexture,0);const Q=n.get(b.depthTexture).__webglTexture,J=Rt(b);if(b.depthTexture.format===si)dt(b)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(b.depthTexture.format===Ki)dt(b)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function At(C){const b=n.get(C),V=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");It(b.__webglFramebuffer,C)}else if(V){b.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[Q]),b.__webglDepthbuffer[Q]=i.createRenderbuffer(),Lt(b.__webglDepthbuffer[Q],C,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=i.createRenderbuffer(),Lt(b.__webglDepthbuffer,C,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Xt(C,b,V){const Q=n.get(C);b!==void 0&&_t(Q.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&At(C)}function z(C){const b=C.texture,V=n.get(C),Q=n.get(b);C.addEventListener("dispose",P),C.isWebGLMultipleRenderTargets!==!0&&(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=b.version,a.memory.textures++);const J=C.isWebGLCubeRenderTarget===!0,tt=C.isWebGLMultipleRenderTargets===!0,pt=m(C)||o;if(J){V.__webglFramebuffer=[];for(let at=0;at<6;at++)if(o&&b.mipmaps&&b.mipmaps.length>0){V.__webglFramebuffer[at]=[];for(let ut=0;ut<b.mipmaps.length;ut++)V.__webglFramebuffer[at][ut]=i.createFramebuffer()}else V.__webglFramebuffer[at]=i.createFramebuffer()}else{if(o&&b.mipmaps&&b.mipmaps.length>0){V.__webglFramebuffer=[];for(let at=0;at<b.mipmaps.length;at++)V.__webglFramebuffer[at]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(tt)if(s.drawBuffers){const at=C.texture;for(let ut=0,yt=at.length;ut<yt;ut++){const Bt=n.get(at[ut]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&C.samples>0&&dt(C)===!1){const at=tt?b:[b];V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ut=0;ut<at.length;ut++){const yt=at[ut];V.__webglColorRenderbuffer[ut]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ut]);const Bt=r.convert(yt.format,yt.colorSpace),j=r.convert(yt.type),jt=g(yt.internalFormat,Bt,j,yt.colorSpace,C.isXRRenderTarget===!0),Wt=Rt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,jt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,V.__webglColorRenderbuffer[ut])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),Lt(V.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){e.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),X(i.TEXTURE_CUBE_MAP,b,pt);for(let at=0;at<6;at++)if(o&&b.mipmaps&&b.mipmaps.length>0)for(let ut=0;ut<b.mipmaps.length;ut++)_t(V.__webglFramebuffer[at][ut],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+at,ut);else _t(V.__webglFramebuffer[at],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);M(b,pt)&&v(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(tt){const at=C.texture;for(let ut=0,yt=at.length;ut<yt;ut++){const Bt=at[ut],j=n.get(Bt);e.bindTexture(i.TEXTURE_2D,j.__webglTexture),X(i.TEXTURE_2D,Bt,pt),_t(V.__webglFramebuffer,C,Bt,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,0),M(Bt,pt)&&v(i.TEXTURE_2D)}e.unbindTexture()}else{let at=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(o?at=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(at,Q.__webglTexture),X(at,b,pt),o&&b.mipmaps&&b.mipmaps.length>0)for(let ut=0;ut<b.mipmaps.length;ut++)_t(V.__webglFramebuffer[ut],C,b,i.COLOR_ATTACHMENT0,at,ut);else _t(V.__webglFramebuffer,C,b,i.COLOR_ATTACHMENT0,at,0);M(b,pt)&&v(at),e.unbindTexture()}C.depthBuffer&&At(C)}function Re(C){const b=m(C)||o,V=C.isWebGLMultipleRenderTargets===!0?C.texture:[C.texture];for(let Q=0,J=V.length;Q<J;Q++){const tt=V[Q];if(M(tt,b)){const pt=C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,at=n.get(tt).__webglTexture;e.bindTexture(pt,at),v(pt),e.unbindTexture()}}}function vt(C){if(o&&C.samples>0&&dt(C)===!1){const b=C.isWebGLMultipleRenderTargets?C.texture:[C.texture],V=C.width,Q=C.height;let J=i.COLOR_BUFFER_BIT;const tt=[],pt=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=n.get(C),ut=C.isWebGLMultipleRenderTargets===!0;if(ut)for(let yt=0;yt<b.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,at.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,at.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,at.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,at.__webglFramebuffer);for(let yt=0;yt<b.length;yt++){tt.push(i.COLOR_ATTACHMENT0+yt),C.depthBuffer&&tt.push(pt);const Bt=at.__ignoreDepthValues!==void 0?at.__ignoreDepthValues:!1;if(Bt===!1&&(C.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),ut&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,at.__webglColorRenderbuffer[yt]),Bt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[pt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[pt])),ut){const j=n.get(b[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,j,0)}i.blitFramebuffer(0,0,V,Q,0,0,V,Q,J,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,tt)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ut)for(let yt=0;yt<b.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,at.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,at.__webglColorRenderbuffer[yt]);const Bt=n.get(b[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,at.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,Bt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,at.__webglMultisampledFramebuffer)}}function Rt(C){return Math.min(s.maxSamples,C.samples)}function dt(C){const b=n.get(C);return o&&C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function re(C){const b=a.render.frame;h.get(C)!==b&&(h.set(C,b),C.update())}function Ft(C,b){const V=C.colorSpace,Q=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||C.format===Yo||V!==Cn&&V!==Ke&&(Jt.getTransfer(V)===ie?o===!1?t.has("EXT_sRGB")===!0&&Q===cn?(C.format=Yo,C.minFilter=qe,C.generateMipmaps=!1):b=Vl.sRGBToLinear(b):(Q!==cn||J!==Wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),b}this.allocateTextureUnit=R,this.resetTextureUnits=B,this.setTexture2D=F,this.setTexture2DArray=Y,this.setTexture3D=q,this.setTextureCube=Z,this.rebindTextures=Xt,this.setupRenderTarget=z,this.updateRenderTargetMipmap=Re,this.updateMultisampleRenderTarget=vt,this.setupDepthRenderbuffer=At,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=dt}function F_(i,t,e){const n=e.isWebGL2;function s(r,a=Ke){let o;const c=Jt.getTransfer(a);if(r===Wn)return i.UNSIGNED_BYTE;if(r===Ul)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Dl)return i.UNSIGNED_SHORT_5_5_5_1;if(r===iu)return i.BYTE;if(r===su)return i.SHORT;if(r===aa)return i.UNSIGNED_SHORT;if(r===Ll)return i.INT;if(r===zn)return i.UNSIGNED_INT;if(r===Hn)return i.FLOAT;if(r===bs)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===ru)return i.ALPHA;if(r===cn)return i.RGBA;if(r===ou)return i.LUMINANCE;if(r===au)return i.LUMINANCE_ALPHA;if(r===si)return i.DEPTH_COMPONENT;if(r===Ki)return i.DEPTH_STENCIL;if(r===Yo)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===cu)return i.RED;if(r===Il)return i.RED_INTEGER;if(r===lu)return i.RG;if(r===Ol)return i.RG_INTEGER;if(r===Nl)return i.RGBA_INTEGER;if(r===qr||r===Zr||r===Kr||r===$r)if(c===ie)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===qr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Zr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Kr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===$r)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===qr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Zr)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Kr)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===$r)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ia||r===Oa||r===Na||r===Fa)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Ia)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Oa)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Na)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Fa)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Fl)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Ba||r===za)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===Ba)return c===ie?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===za)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ha||r===Va||r===Ga||r===ka||r===Wa||r===Xa||r===Ya||r===qa||r===Za||r===Ka||r===$a||r===ja||r===Ja||r===Qa)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Ha)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Va)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ga)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ka)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Wa)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Xa)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ya)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===qa)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Za)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ka)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===$a)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===ja)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Ja)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Qa)return c===ie?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===jr||r===tc||r===ec)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===jr)return c===ie?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===tc)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===ec)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===hu||r===nc||r===ic||r===sc)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===jr)return o.COMPRESSED_RED_RGTC1_EXT;if(r===nc)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ic)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===sc)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ii?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class B_ extends Ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class tr extends Ce{constructor(){super(),this.isGroup=!0,this.type="Group"}}const z_={type:"move"};class Mo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new tr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new tr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new tr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),d=this._getHandJoint(l,x);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],u=h.position.distanceTo(f.position),p=.02,_=.005;l.inputState.pinching&&u>p+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=p-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(z_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new tr;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class H_ extends ji{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,f=null,u=null,p=null,_=null;const x=e.getContextAttributes();let m=null,d=null;const M=[],v=[],g=new kt;let y=null;const A=new Ze;A.layers.enable(1),A.viewport=new pe;const T=new Ze;T.layers.enable(2),T.viewport=new pe;const P=[A,T],E=new B_;E.layers.enable(1),E.layers.enable(2);let S=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let $=M[X];return $===void 0&&($=new Mo,M[X]=$),$.getTargetRaySpace()},this.getControllerGrip=function(X){let $=M[X];return $===void 0&&($=new Mo,M[X]=$),$.getGripSpace()},this.getHand=function(X){let $=M[X];return $===void 0&&($=new Mo,M[X]=$),$.getHandSpace()};function I(X){const $=v.indexOf(X.inputSource);if($===-1)return;const ct=M[$];ct!==void 0&&(ct.update(X.inputSource,X.frame,l||a),ct.dispatchEvent({type:X.type,data:X.inputSource}))}function B(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",R);for(let X=0;X<M.length;X++){const $=v[X];$!==null&&(v[X]=null,M[X].disconnect($))}S=null,D=null,t.setRenderTarget(m),p=null,u=null,f=null,s=null,d=null,nt.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(g.width,g.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return f},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",B),s.addEventListener("inputsourceschange",R),x.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(g),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const $={antialias:s.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,$),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new ai(p.framebufferWidth,p.framebufferHeight,{format:cn,type:Wn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let $=null,ct=null,gt=null;x.depth&&(gt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,$=x.stencil?Ki:si,ct=x.stencil?ii:zn);const _t={colorFormat:e.RGBA8,depthFormat:gt,scaleFactor:r};f=new XRWebGLBinding(s,e),u=f.createProjectionLayer(_t),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),d=new ai(u.textureWidth,u.textureHeight,{format:cn,type:Wn,depthTexture:new Ql(u.textureWidth,u.textureHeight,ct,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});const Lt=t.properties.get(d);Lt.__ignoreDepthValues=u.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),nt.setContext(s),nt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function R(X){for(let $=0;$<X.removed.length;$++){const ct=X.removed[$],gt=v.indexOf(ct);gt>=0&&(v[gt]=null,M[gt].disconnect(ct))}for(let $=0;$<X.added.length;$++){const ct=X.added[$];let gt=v.indexOf(ct);if(gt===-1){for(let Lt=0;Lt<M.length;Lt++)if(Lt>=v.length){v.push(ct),gt=Lt;break}else if(v[Lt]===null){v[Lt]=ct,gt=Lt;break}if(gt===-1)break}const _t=M[gt];_t&&_t.connect(ct)}}const O=new L,F=new L;function Y(X,$,ct){O.setFromMatrixPosition($.matrixWorld),F.setFromMatrixPosition(ct.matrixWorld);const gt=O.distanceTo(F),_t=$.projectionMatrix.elements,Lt=ct.projectionMatrix.elements,It=_t[14]/(_t[10]-1),At=_t[14]/(_t[10]+1),Xt=(_t[9]+1)/_t[5],z=(_t[9]-1)/_t[5],Re=(_t[8]-1)/_t[0],vt=(Lt[8]+1)/Lt[0],Rt=It*Re,dt=It*vt,re=gt/(-Re+vt),Ft=re*-Re;$.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Ft),X.translateZ(re),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const C=It+re,b=At+re,V=Rt-Ft,Q=dt+(gt-Ft),J=Xt*At/b*C,tt=z*At/b*C;X.projectionMatrix.makePerspective(V,Q,J,tt,C,b),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function q(X,$){$===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices($.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;E.near=T.near=A.near=X.near,E.far=T.far=A.far=X.far,(S!==E.near||D!==E.far)&&(s.updateRenderState({depthNear:E.near,depthFar:E.far}),S=E.near,D=E.far);const $=X.parent,ct=E.cameras;q(E,$);for(let gt=0;gt<ct.length;gt++)q(ct[gt],$);ct.length===2?Y(E,A,T):E.projectionMatrix.copy(A.projectionMatrix),Z(X,E,$)};function Z(X,$,ct){ct===null?X.matrix.copy($.matrixWorld):(X.matrix.copy(ct.matrixWorld),X.matrix.invert(),X.matrix.multiply($.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy($.projectionMatrix),X.projectionMatrixInverse.copy($.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=ws*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return E},this.getFoveation=function(){if(!(u===null&&p===null))return c},this.setFoveation=function(X){c=X,u!==null&&(u.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)};let K=null;function et(X,$){if(h=$.getViewerPose(l||a),_=$,h!==null){const ct=h.views;p!==null&&(t.setRenderTargetFramebuffer(d,p.framebuffer),t.setRenderTarget(d));let gt=!1;ct.length!==E.cameras.length&&(E.cameras.length=0,gt=!0);for(let _t=0;_t<ct.length;_t++){const Lt=ct[_t];let It=null;if(p!==null)It=p.getViewport(Lt);else{const Xt=f.getViewSubImage(u,Lt);It=Xt.viewport,_t===0&&(t.setRenderTargetTextures(d,Xt.colorTexture,u.ignoreDepthValues?void 0:Xt.depthStencilTexture),t.setRenderTarget(d))}let At=P[_t];At===void 0&&(At=new Ze,At.layers.enable(_t),At.viewport=new pe,P[_t]=At),At.matrix.fromArray(Lt.transform.matrix),At.matrix.decompose(At.position,At.quaternion,At.scale),At.projectionMatrix.fromArray(Lt.projectionMatrix),At.projectionMatrixInverse.copy(At.projectionMatrix).invert(),At.viewport.set(It.x,It.y,It.width,It.height),_t===0&&(E.matrix.copy(At.matrix),E.matrix.decompose(E.position,E.quaternion,E.scale)),gt===!0&&E.cameras.push(At)}}for(let ct=0;ct<M.length;ct++){const gt=v[ct],_t=M[ct];gt!==null&&_t!==void 0&&_t.update(gt,$,l||a)}K&&K(X,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),_=null}const nt=new jl;nt.setAnimationLoop(et),this.setAnimationLoop=function(X){K=X},this.dispose=function(){}}}function V_(i,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Zl(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,M,v,g){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),f(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),u(m,d),d.isMeshPhysicalMaterial&&p(m,d,g)):d.isMeshMatcapMaterial?(r(m,d),_(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),x(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?c(m,d,M,v):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Oe&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Oe&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const M=t.get(d).envMap;if(M&&(m.envMap.value=M,m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const v=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*v,e(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,M,v){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*M,m.scale.value=v*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function f(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function u(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),t.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,M){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Oe&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,d){d.matcap&&(m.matcap.value=d.matcap)}function x(m,d){const M=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function G_(i,t,e,n){let s={},r={},a=[];const o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(M,v){const g=v.program;n.uniformBlockBinding(M,g)}function l(M,v){let g=s[M.id];g===void 0&&(_(M),g=h(M),s[M.id]=g,M.addEventListener("dispose",m));const y=v.program;n.updateUBOMapping(M,y);const A=t.render.frame;r[M.id]!==A&&(u(M),r[M.id]=A)}function h(M){const v=f();M.__bindingPointIndex=v;const g=i.createBuffer(),y=M.__size,A=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,g),i.bufferData(i.UNIFORM_BUFFER,y,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,g),g}function f(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const v=s[M.id],g=M.uniforms,y=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,T=g.length;A<T;A++){const P=Array.isArray(g[A])?g[A]:[g[A]];for(let E=0,S=P.length;E<S;E++){const D=P[E];if(p(D,A,E,y)===!0){const I=D.__offset,B=Array.isArray(D.value)?D.value:[D.value];let R=0;for(let O=0;O<B.length;O++){const F=B[O],Y=x(F);typeof F=="number"||typeof F=="boolean"?(D.__data[0]=F,i.bufferSubData(i.UNIFORM_BUFFER,I+R,D.__data)):F.isMatrix3?(D.__data[0]=F.elements[0],D.__data[1]=F.elements[1],D.__data[2]=F.elements[2],D.__data[3]=0,D.__data[4]=F.elements[3],D.__data[5]=F.elements[4],D.__data[6]=F.elements[5],D.__data[7]=0,D.__data[8]=F.elements[6],D.__data[9]=F.elements[7],D.__data[10]=F.elements[8],D.__data[11]=0):(F.toArray(D.__data,R),R+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,v,g,y){const A=M.value,T=v+"_"+g;if(y[T]===void 0)return typeof A=="number"||typeof A=="boolean"?y[T]=A:y[T]=A.clone(),!0;{const P=y[T];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return y[T]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function _(M){const v=M.uniforms;let g=0;const y=16;for(let T=0,P=v.length;T<P;T++){const E=Array.isArray(v[T])?v[T]:[v[T]];for(let S=0,D=E.length;S<D;S++){const I=E[S],B=Array.isArray(I.value)?I.value:[I.value];for(let R=0,O=B.length;R<O;R++){const F=B[R],Y=x(F),q=g%y;q!==0&&y-q<Y.boundary&&(g+=y-q),I.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=g,g+=Y.storage}}}const A=g%y;return A>0&&(g+=y-A),M.__size=g,M.__cache={},this}function x(M){const v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),v}function m(M){const v=M.target;v.removeEventListener("dispose",m);const g=a.indexOf(v.__bindingPointIndex);a.splice(g,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function d(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:d}}class Ko{constructor(t={}){const{canvas:e=Fu(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let u;n!==null?u=n.getContextAttributes().alpha:u=a;const p=new Uint32Array(4),_=new Int32Array(4);let x=null,m=null;const d=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Me,this._useLegacyLights=!1,this.toneMapping=kn,this.toneMappingExposure=1;const v=this;let g=!1,y=0,A=0,T=null,P=-1,E=null;const S=new pe,D=new pe;let I=null;const B=new qt(0);let R=0,O=e.width,F=e.height,Y=1,q=null,Z=null;const K=new pe(0,0,O,F),et=new pe(0,0,O,F);let nt=!1;const X=new fa;let $=!1,ct=!1,gt=null;const _t=new Kt,Lt=new kt,It=new L,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Xt(){return T===null?Y:1}let z=n;function Re(w,N){for(let G=0;G<w.length;G++){const k=w[G],H=e.getContext(k,N);if(H!==null)return H}return null}try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${oa}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",U,!1),e.addEventListener("webglcontextcreationerror",rt,!1),z===null){const N=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&N.shift(),z=Re(N,w),z===null)throw Re(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&z instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),z.getShaderPrecisionFormat===void 0&&(z.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let vt,Rt,dt,re,Ft,C,b,V,Q,J,tt,pt,at,ut,yt,Bt,j,jt,Wt,Ct,xt,ft,Ot,$t;function ce(){vt=new Jp(z),Rt=new Yp(z,vt,t),vt.init(Rt),ft=new F_(z,vt,Rt),dt=new O_(z,vt,Rt),re=new em(z),Ft=new M_,C=new N_(z,vt,dt,Ft,Rt,ft,re),b=new Zp(v),V=new jp(v),Q=new lf(z,Rt),Ot=new Wp(z,vt,Q,Rt),J=new Qp(z,Q,re,Ot),tt=new rm(z,J,Q,re),Wt=new sm(z,Rt,C),Bt=new qp(Ft),pt=new E_(v,b,V,vt,Rt,Ot,Bt),at=new V_(v,Ft),ut=new y_,yt=new R_(vt,Rt),jt=new kp(v,b,V,dt,tt,u,c),j=new I_(v,tt,Rt),$t=new G_(z,re,Rt,dt),Ct=new Xp(z,vt,re,Rt),xt=new tm(z,vt,re,Rt),re.programs=pt.programs,v.capabilities=Rt,v.extensions=vt,v.properties=Ft,v.renderLists=ut,v.shadowMap=j,v.state=dt,v.info=re}ce();const Ht=new H_(v,z);this.xr=Ht,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const w=vt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=vt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(w){w!==void 0&&(Y=w,this.setSize(O,F,!1))},this.getSize=function(w){return w.set(O,F)},this.setSize=function(w,N,G=!0){if(Ht.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=w,F=N,e.width=Math.floor(w*Y),e.height=Math.floor(N*Y),G===!0&&(e.style.width=w+"px",e.style.height=N+"px"),this.setViewport(0,0,w,N)},this.getDrawingBufferSize=function(w){return w.set(O*Y,F*Y).floor()},this.setDrawingBufferSize=function(w,N,G){O=w,F=N,Y=G,e.width=Math.floor(w*G),e.height=Math.floor(N*G),this.setViewport(0,0,w,N)},this.getCurrentViewport=function(w){return w.copy(S)},this.getViewport=function(w){return w.copy(K)},this.setViewport=function(w,N,G,k){w.isVector4?K.set(w.x,w.y,w.z,w.w):K.set(w,N,G,k),dt.viewport(S.copy(K).multiplyScalar(Y).floor())},this.getScissor=function(w){return w.copy(et)},this.setScissor=function(w,N,G,k){w.isVector4?et.set(w.x,w.y,w.z,w.w):et.set(w,N,G,k),dt.scissor(D.copy(et).multiplyScalar(Y).floor())},this.getScissorTest=function(){return nt},this.setScissorTest=function(w){dt.setScissorTest(nt=w)},this.setOpaqueSort=function(w){q=w},this.setTransparentSort=function(w){Z=w},this.getClearColor=function(w){return w.copy(jt.getClearColor())},this.setClearColor=function(){jt.setClearColor.apply(jt,arguments)},this.getClearAlpha=function(){return jt.getClearAlpha()},this.setClearAlpha=function(){jt.setClearAlpha.apply(jt,arguments)},this.clear=function(w=!0,N=!0,G=!0){let k=0;if(w){let H=!1;if(T!==null){const lt=T.texture.format;H=lt===Nl||lt===Ol||lt===Il}if(H){const lt=T.texture.type,mt=lt===Wn||lt===zn||lt===aa||lt===ii||lt===Ul||lt===Dl,St=jt.getClearColor(),wt=jt.getClearAlpha(),zt=St.r,Pt=St.g,Ut=St.b;mt?(p[0]=zt,p[1]=Pt,p[2]=Ut,p[3]=wt,z.clearBufferuiv(z.COLOR,0,p)):(_[0]=zt,_[1]=Pt,_[2]=Ut,_[3]=wt,z.clearBufferiv(z.COLOR,0,_))}else k|=z.COLOR_BUFFER_BIT}N&&(k|=z.DEPTH_BUFFER_BIT),G&&(k|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",U,!1),e.removeEventListener("webglcontextcreationerror",rt,!1),ut.dispose(),yt.dispose(),Ft.dispose(),b.dispose(),V.dispose(),tt.dispose(),Ot.dispose(),$t.dispose(),pt.dispose(),Ht.dispose(),Ht.removeEventListener("sessionstart",Pe),Ht.removeEventListener("sessionend",ee),gt&&(gt.dispose(),gt=null),Le.stop()};function it(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),g=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),g=!1;const w=re.autoReset,N=j.enabled,G=j.autoUpdate,k=j.needsUpdate,H=j.type;ce(),re.autoReset=w,j.enabled=N,j.autoUpdate=G,j.needsUpdate=k,j.type=H}function rt(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ot(w){const N=w.target;N.removeEventListener("dispose",ot),bt(N)}function bt(w){Et(w),Ft.remove(w)}function Et(w){const N=Ft.get(w).programs;N!==void 0&&(N.forEach(function(G){pt.releaseProgram(G)}),w.isShaderMaterial&&pt.releaseShaderCache(w))}this.renderBufferDirect=function(w,N,G,k,H,lt){N===null&&(N=At);const mt=H.isMesh&&H.matrixWorld.determinant()<0,St=mh(w,N,G,k,H);dt.setMaterial(k,mt);let wt=G.index,zt=1;if(k.wireframe===!0){if(wt=J.getWireframeAttribute(G),wt===void 0)return;zt=2}const Pt=G.drawRange,Ut=G.attributes.position;let he=Pt.start*zt,Be=(Pt.start+Pt.count)*zt;lt!==null&&(he=Math.max(he,lt.start*zt),Be=Math.min(Be,(lt.start+lt.count)*zt)),wt!==null?(he=Math.max(he,0),Be=Math.min(Be,wt.count)):Ut!=null&&(he=Math.max(he,0),Be=Math.min(Be,Ut.count));const xe=Be-he;if(xe<0||xe===1/0)return;Ot.setup(H,k,St,G,wt);let gn,oe=Ct;if(wt!==null&&(gn=Q.get(wt),oe=xt,oe.setIndex(gn)),H.isMesh)k.wireframe===!0?(dt.setLineWidth(k.wireframeLinewidth*Xt()),oe.setMode(z.LINES)):oe.setMode(z.TRIANGLES);else if(H.isLine){let Vt=k.linewidth;Vt===void 0&&(Vt=1),dt.setLineWidth(Vt*Xt()),H.isLineSegments?oe.setMode(z.LINES):H.isLineLoop?oe.setMode(z.LINE_LOOP):oe.setMode(z.LINE_STRIP)}else H.isPoints?oe.setMode(z.POINTS):H.isSprite&&oe.setMode(z.TRIANGLES);if(H.isBatchedMesh)oe.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else if(H.isInstancedMesh)oe.renderInstances(he,xe,H.count);else if(G.isInstancedBufferGeometry){const Vt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Gr=Math.min(G.instanceCount,Vt);oe.renderInstances(he,xe,Gr)}else oe.render(he,xe)};function Qt(w,N,G){w.transparent===!0&&w.side===mn&&w.forceSinglePass===!1?(w.side=Oe,w.needsUpdate=!0,Ls(w,N,G),w.side=_n,w.needsUpdate=!0,Ls(w,N,G),w.side=mn):Ls(w,N,G)}this.compile=function(w,N,G=null){G===null&&(G=w),m=yt.get(G),m.init(),M.push(m),G.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),w!==G&&w.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights(v._useLegacyLights);const k=new Set;return w.traverse(function(H){const lt=H.material;if(lt)if(Array.isArray(lt))for(let mt=0;mt<lt.length;mt++){const St=lt[mt];Qt(St,G,H),k.add(St)}else Qt(lt,G,H),k.add(lt)}),M.pop(),m=null,k},this.compileAsync=function(w,N,G=null){const k=this.compile(w,N,G);return new Promise(H=>{function lt(){if(k.forEach(function(mt){Ft.get(mt).currentProgram.isReady()&&k.delete(mt)}),k.size===0){H(w);return}setTimeout(lt,10)}vt.get("KHR_parallel_shader_compile")!==null?lt():setTimeout(lt,10)})};let te=null;function ge(w){te&&te(w)}function Pe(){Le.stop()}function ee(){Le.start()}const Le=new jl;Le.setAnimationLoop(ge),typeof self<"u"&&Le.setContext(self),this.setAnimationLoop=function(w){te=w,Ht.setAnimationLoop(w),w===null?Le.stop():Le.start()},Ht.addEventListener("sessionstart",Pe),Ht.addEventListener("sessionend",ee),this.render=function(w,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(g===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Ht.enabled===!0&&Ht.isPresenting===!0&&(Ht.cameraAutoUpdate===!0&&Ht.updateCamera(N),N=Ht.getCamera()),w.isScene===!0&&w.onBeforeRender(v,w,N,T),m=yt.get(w,M.length),m.init(),M.push(m),_t.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),X.setFromProjectionMatrix(_t),ct=this.localClippingEnabled,$=Bt.init(this.clippingPlanes,ct),x=ut.get(w,d.length),x.init(),d.push(x),un(w,N,0,v.sortObjects),x.finish(),v.sortObjects===!0&&x.sort(q,Z),this.info.render.frame++,$===!0&&Bt.beginShadows();const G=m.state.shadowsArray;if(j.render(G,w,N),$===!0&&Bt.endShadows(),this.info.autoReset===!0&&this.info.reset(),jt.render(x,w),m.setupLights(v._useLegacyLights),N.isArrayCamera){const k=N.cameras;for(let H=0,lt=k.length;H<lt;H++){const mt=k[H];Ma(x,w,mt,mt.viewport)}}else Ma(x,w,N);T!==null&&(C.updateMultisampleRenderTarget(T),C.updateRenderTargetMipmap(T)),w.isScene===!0&&w.onAfterRender(v,w,N),Ot.resetDefaultState(),P=-1,E=null,M.pop(),M.length>0?m=M[M.length-1]:m=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function un(w,N,G,k){if(w.visible===!1)return;if(w.layers.test(N.layers)){if(w.isGroup)G=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(N);else if(w.isLight)m.pushLight(w),w.castShadow&&m.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||X.intersectsSprite(w)){k&&It.setFromMatrixPosition(w.matrixWorld).applyMatrix4(_t);const mt=tt.update(w),St=w.material;St.visible&&x.push(w,mt,St,G,It.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||X.intersectsObject(w))){const mt=tt.update(w),St=w.material;if(k&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),It.copy(w.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),It.copy(mt.boundingSphere.center)),It.applyMatrix4(w.matrixWorld).applyMatrix4(_t)),Array.isArray(St)){const wt=mt.groups;for(let zt=0,Pt=wt.length;zt<Pt;zt++){const Ut=wt[zt],he=St[Ut.materialIndex];he&&he.visible&&x.push(w,mt,he,G,It.z,Ut)}}else St.visible&&x.push(w,mt,St,G,It.z,null)}}const lt=w.children;for(let mt=0,St=lt.length;mt<St;mt++)un(lt[mt],N,G,k)}function Ma(w,N,G,k){const H=w.opaque,lt=w.transmissive,mt=w.transparent;m.setupLightsView(G),$===!0&&Bt.setGlobalState(v.clippingPlanes,G),lt.length>0&&ph(H,lt,N,G),k&&dt.viewport(S.copy(k)),H.length>0&&Ps(H,N,G),lt.length>0&&Ps(lt,N,G),mt.length>0&&Ps(mt,N,G),dt.buffers.depth.setTest(!0),dt.buffers.depth.setMask(!0),dt.buffers.color.setMask(!0),dt.setPolygonOffset(!1)}function ph(w,N,G,k){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;const lt=Rt.isWebGL2;gt===null&&(gt=new ai(1,1,{generateMipmaps:!0,type:vt.has("EXT_color_buffer_half_float")?bs:Wn,minFilter:As,samples:lt?4:0})),v.getDrawingBufferSize(Lt),lt?gt.setSize(Lt.x,Lt.y):gt.setSize(Cr(Lt.x),Cr(Lt.y));const mt=v.getRenderTarget();v.setRenderTarget(gt),v.getClearColor(B),R=v.getClearAlpha(),R<1&&v.setClearColor(16777215,.5),v.clear();const St=v.toneMapping;v.toneMapping=kn,Ps(w,G,k),C.updateMultisampleRenderTarget(gt),C.updateRenderTargetMipmap(gt);let wt=!1;for(let zt=0,Pt=N.length;zt<Pt;zt++){const Ut=N[zt],he=Ut.object,Be=Ut.geometry,xe=Ut.material,gn=Ut.group;if(xe.side===mn&&he.layers.test(k.layers)){const oe=xe.side;xe.side=Oe,xe.needsUpdate=!0,Sa(he,G,k,Be,xe,gn),xe.side=oe,xe.needsUpdate=!0,wt=!0}}wt===!0&&(C.updateMultisampleRenderTarget(gt),C.updateRenderTargetMipmap(gt)),v.setRenderTarget(mt),v.setClearColor(B,R),v.toneMapping=St}function Ps(w,N,G){const k=N.isScene===!0?N.overrideMaterial:null;for(let H=0,lt=w.length;H<lt;H++){const mt=w[H],St=mt.object,wt=mt.geometry,zt=k===null?mt.material:k,Pt=mt.group;St.layers.test(G.layers)&&Sa(St,N,G,wt,zt,Pt)}}function Sa(w,N,G,k,H,lt){w.onBeforeRender(v,N,G,k,H,lt),w.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),H.onBeforeRender(v,N,G,k,w,lt),H.transparent===!0&&H.side===mn&&H.forceSinglePass===!1?(H.side=Oe,H.needsUpdate=!0,v.renderBufferDirect(G,N,k,H,w,lt),H.side=_n,H.needsUpdate=!0,v.renderBufferDirect(G,N,k,H,w,lt),H.side=mn):v.renderBufferDirect(G,N,k,H,w,lt),w.onAfterRender(v,N,G,k,H,lt)}function Ls(w,N,G){N.isScene!==!0&&(N=At);const k=Ft.get(w),H=m.state.lights,lt=m.state.shadowsArray,mt=H.state.version,St=pt.getParameters(w,H.state,lt,N,G),wt=pt.getProgramCacheKey(St);let zt=k.programs;k.environment=w.isMeshStandardMaterial?N.environment:null,k.fog=N.fog,k.envMap=(w.isMeshStandardMaterial?V:b).get(w.envMap||k.environment),zt===void 0&&(w.addEventListener("dispose",ot),zt=new Map,k.programs=zt);let Pt=zt.get(wt);if(Pt!==void 0){if(k.currentProgram===Pt&&k.lightsStateVersion===mt)return Ta(w,St),Pt}else St.uniforms=pt.getUniforms(w),w.onBuild(G,St,v),w.onBeforeCompile(St,v),Pt=pt.acquireProgram(St,wt),zt.set(wt,Pt),k.uniforms=St.uniforms;const Ut=k.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ut.clippingPlanes=Bt.uniform),Ta(w,St),k.needsLights=gh(w),k.lightsStateVersion=mt,k.needsLights&&(Ut.ambientLightColor.value=H.state.ambient,Ut.lightProbe.value=H.state.probe,Ut.directionalLights.value=H.state.directional,Ut.directionalLightShadows.value=H.state.directionalShadow,Ut.spotLights.value=H.state.spot,Ut.spotLightShadows.value=H.state.spotShadow,Ut.rectAreaLights.value=H.state.rectArea,Ut.ltc_1.value=H.state.rectAreaLTC1,Ut.ltc_2.value=H.state.rectAreaLTC2,Ut.pointLights.value=H.state.point,Ut.pointLightShadows.value=H.state.pointShadow,Ut.hemisphereLights.value=H.state.hemi,Ut.directionalShadowMap.value=H.state.directionalShadowMap,Ut.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ut.spotShadowMap.value=H.state.spotShadowMap,Ut.spotLightMatrix.value=H.state.spotLightMatrix,Ut.spotLightMap.value=H.state.spotLightMap,Ut.pointShadowMap.value=H.state.pointShadowMap,Ut.pointShadowMatrix.value=H.state.pointShadowMatrix),k.currentProgram=Pt,k.uniformsList=null,Pt}function ya(w){if(w.uniformsList===null){const N=w.currentProgram.getUniforms();w.uniformsList=Mr.seqWithValue(N.seq,w.uniforms)}return w.uniformsList}function Ta(w,N){const G=Ft.get(w);G.outputColorSpace=N.outputColorSpace,G.batching=N.batching,G.instancing=N.instancing,G.instancingColor=N.instancingColor,G.skinning=N.skinning,G.morphTargets=N.morphTargets,G.morphNormals=N.morphNormals,G.morphColors=N.morphColors,G.morphTargetsCount=N.morphTargetsCount,G.numClippingPlanes=N.numClippingPlanes,G.numIntersection=N.numClipIntersection,G.vertexAlphas=N.vertexAlphas,G.vertexTangents=N.vertexTangents,G.toneMapping=N.toneMapping}function mh(w,N,G,k,H){N.isScene!==!0&&(N=At),C.resetTextureUnits();const lt=N.fog,mt=k.isMeshStandardMaterial?N.environment:null,St=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Cn,wt=(k.isMeshStandardMaterial?V:b).get(k.envMap||mt),zt=k.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Pt=!!G.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ut=!!G.morphAttributes.position,he=!!G.morphAttributes.normal,Be=!!G.morphAttributes.color;let xe=kn;k.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(xe=v.toneMapping);const gn=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,oe=gn!==void 0?gn.length:0,Vt=Ft.get(k),Gr=m.state.lights;if($===!0&&(ct===!0||w!==E)){const We=w===E&&k.id===P;Bt.setState(k,w,We)}let le=!1;k.version===Vt.__version?(Vt.needsLights&&Vt.lightsStateVersion!==Gr.state.version||Vt.outputColorSpace!==St||H.isBatchedMesh&&Vt.batching===!1||!H.isBatchedMesh&&Vt.batching===!0||H.isInstancedMesh&&Vt.instancing===!1||!H.isInstancedMesh&&Vt.instancing===!0||H.isSkinnedMesh&&Vt.skinning===!1||!H.isSkinnedMesh&&Vt.skinning===!0||H.isInstancedMesh&&Vt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Vt.instancingColor===!1&&H.instanceColor!==null||Vt.envMap!==wt||k.fog===!0&&Vt.fog!==lt||Vt.numClippingPlanes!==void 0&&(Vt.numClippingPlanes!==Bt.numPlanes||Vt.numIntersection!==Bt.numIntersection)||Vt.vertexAlphas!==zt||Vt.vertexTangents!==Pt||Vt.morphTargets!==Ut||Vt.morphNormals!==he||Vt.morphColors!==Be||Vt.toneMapping!==xe||Rt.isWebGL2===!0&&Vt.morphTargetsCount!==oe)&&(le=!0):(le=!0,Vt.__version=k.version);let Yn=Vt.currentProgram;le===!0&&(Yn=Ls(k,N,H));let Aa=!1,ss=!1,kr=!1;const Te=Yn.getUniforms(),qn=Vt.uniforms;if(dt.useProgram(Yn.program)&&(Aa=!0,ss=!0,kr=!0),k.id!==P&&(P=k.id,ss=!0),Aa||E!==w){Te.setValue(z,"projectionMatrix",w.projectionMatrix),Te.setValue(z,"viewMatrix",w.matrixWorldInverse);const We=Te.map.cameraPosition;We!==void 0&&We.setValue(z,It.setFromMatrixPosition(w.matrixWorld)),Rt.logarithmicDepthBuffer&&Te.setValue(z,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&Te.setValue(z,"isOrthographic",w.isOrthographicCamera===!0),E!==w&&(E=w,ss=!0,kr=!0)}if(H.isSkinnedMesh){Te.setOptional(z,H,"bindMatrix"),Te.setOptional(z,H,"bindMatrixInverse");const We=H.skeleton;We&&(Rt.floatVertexTextures?(We.boneTexture===null&&We.computeBoneTexture(),Te.setValue(z,"boneTexture",We.boneTexture,C)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}H.isBatchedMesh&&(Te.setOptional(z,H,"batchingTexture"),Te.setValue(z,"batchingTexture",H._matricesTexture,C));const Wr=G.morphAttributes;if((Wr.position!==void 0||Wr.normal!==void 0||Wr.color!==void 0&&Rt.isWebGL2===!0)&&Wt.update(H,G,Yn),(ss||Vt.receiveShadow!==H.receiveShadow)&&(Vt.receiveShadow=H.receiveShadow,Te.setValue(z,"receiveShadow",H.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(qn.envMap.value=wt,qn.flipEnvMap.value=wt.isCubeTexture&&wt.isRenderTargetTexture===!1?-1:1),ss&&(Te.setValue(z,"toneMappingExposure",v.toneMappingExposure),Vt.needsLights&&_h(qn,kr),lt&&k.fog===!0&&at.refreshFogUniforms(qn,lt),at.refreshMaterialUniforms(qn,k,Y,F,gt),Mr.upload(z,ya(Vt),qn,C)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Mr.upload(z,ya(Vt),qn,C),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&Te.setValue(z,"center",H.center),Te.setValue(z,"modelViewMatrix",H.modelViewMatrix),Te.setValue(z,"normalMatrix",H.normalMatrix),Te.setValue(z,"modelMatrix",H.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const We=k.uniformsGroups;for(let Xr=0,xh=We.length;Xr<xh;Xr++)if(Rt.isWebGL2){const ba=We[Xr];$t.update(ba,Yn),$t.bind(ba,Yn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Yn}function _h(w,N){w.ambientLightColor.needsUpdate=N,w.lightProbe.needsUpdate=N,w.directionalLights.needsUpdate=N,w.directionalLightShadows.needsUpdate=N,w.pointLights.needsUpdate=N,w.pointLightShadows.needsUpdate=N,w.spotLights.needsUpdate=N,w.spotLightShadows.needsUpdate=N,w.rectAreaLights.needsUpdate=N,w.hemisphereLights.needsUpdate=N}function gh(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(w,N,G){Ft.get(w.texture).__webglTexture=N,Ft.get(w.depthTexture).__webglTexture=G;const k=Ft.get(w);k.__hasExternalTextures=!0,k.__hasExternalTextures&&(k.__autoAllocateDepthBuffer=G===void 0,k.__autoAllocateDepthBuffer||vt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(w,N){const G=Ft.get(w);G.__webglFramebuffer=N,G.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(w,N=0,G=0){T=w,y=N,A=G;let k=!0,H=null,lt=!1,mt=!1;if(w){const wt=Ft.get(w);wt.__useDefaultFramebuffer!==void 0?(dt.bindFramebuffer(z.FRAMEBUFFER,null),k=!1):wt.__webglFramebuffer===void 0?C.setupRenderTarget(w):wt.__hasExternalTextures&&C.rebindTextures(w,Ft.get(w.texture).__webglTexture,Ft.get(w.depthTexture).__webglTexture);const zt=w.texture;(zt.isData3DTexture||zt.isDataArrayTexture||zt.isCompressedArrayTexture)&&(mt=!0);const Pt=Ft.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Pt[N])?H=Pt[N][G]:H=Pt[N],lt=!0):Rt.isWebGL2&&w.samples>0&&C.useMultisampledRTT(w)===!1?H=Ft.get(w).__webglMultisampledFramebuffer:Array.isArray(Pt)?H=Pt[G]:H=Pt,S.copy(w.viewport),D.copy(w.scissor),I=w.scissorTest}else S.copy(K).multiplyScalar(Y).floor(),D.copy(et).multiplyScalar(Y).floor(),I=nt;if(dt.bindFramebuffer(z.FRAMEBUFFER,H)&&Rt.drawBuffers&&k&&dt.drawBuffers(w,H),dt.viewport(S),dt.scissor(D),dt.setScissorTest(I),lt){const wt=Ft.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+N,wt.__webglTexture,G)}else if(mt){const wt=Ft.get(w.texture),zt=N||0;z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,wt.__webglTexture,G||0,zt)}P=-1},this.readRenderTargetPixels=function(w,N,G,k,H,lt,mt){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=Ft.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&mt!==void 0&&(St=St[mt]),St){dt.bindFramebuffer(z.FRAMEBUFFER,St);try{const wt=w.texture,zt=wt.format,Pt=wt.type;if(zt!==cn&&ft.convert(zt)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ut=Pt===bs&&(vt.has("EXT_color_buffer_half_float")||Rt.isWebGL2&&vt.has("EXT_color_buffer_float"));if(Pt!==Wn&&ft.convert(Pt)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Pt===Hn&&(Rt.isWebGL2||vt.has("OES_texture_float")||vt.has("WEBGL_color_buffer_float")))&&!Ut){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=w.width-k&&G>=0&&G<=w.height-H&&z.readPixels(N,G,k,H,ft.convert(zt),ft.convert(Pt),lt)}finally{const wt=T!==null?Ft.get(T).__webglFramebuffer:null;dt.bindFramebuffer(z.FRAMEBUFFER,wt)}}},this.copyFramebufferToTexture=function(w,N,G=0){const k=Math.pow(2,-G),H=Math.floor(N.image.width*k),lt=Math.floor(N.image.height*k);C.setTexture2D(N,0),z.copyTexSubImage2D(z.TEXTURE_2D,G,0,0,w.x,w.y,H,lt),dt.unbindTexture()},this.copyTextureToTexture=function(w,N,G,k=0){const H=N.image.width,lt=N.image.height,mt=ft.convert(G.format),St=ft.convert(G.type);C.setTexture2D(G,0),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,G.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,G.unpackAlignment),N.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,k,w.x,w.y,H,lt,mt,St,N.image.data):N.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,k,w.x,w.y,N.mipmaps[0].width,N.mipmaps[0].height,mt,N.mipmaps[0].data):z.texSubImage2D(z.TEXTURE_2D,k,w.x,w.y,mt,St,N.image),k===0&&G.generateMipmaps&&z.generateMipmap(z.TEXTURE_2D),dt.unbindTexture()},this.copyTextureToTexture3D=function(w,N,G,k,H=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const lt=w.max.x-w.min.x+1,mt=w.max.y-w.min.y+1,St=w.max.z-w.min.z+1,wt=ft.convert(k.format),zt=ft.convert(k.type);let Pt;if(k.isData3DTexture)C.setTexture3D(k,0),Pt=z.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)C.setTexture2DArray(k,0),Pt=z.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,k.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,k.unpackAlignment);const Ut=z.getParameter(z.UNPACK_ROW_LENGTH),he=z.getParameter(z.UNPACK_IMAGE_HEIGHT),Be=z.getParameter(z.UNPACK_SKIP_PIXELS),xe=z.getParameter(z.UNPACK_SKIP_ROWS),gn=z.getParameter(z.UNPACK_SKIP_IMAGES),oe=G.isCompressedTexture?G.mipmaps[H]:G.image;z.pixelStorei(z.UNPACK_ROW_LENGTH,oe.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,oe.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,w.min.x),z.pixelStorei(z.UNPACK_SKIP_ROWS,w.min.y),z.pixelStorei(z.UNPACK_SKIP_IMAGES,w.min.z),G.isDataTexture||G.isData3DTexture?z.texSubImage3D(Pt,H,N.x,N.y,N.z,lt,mt,St,wt,zt,oe.data):G.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),z.compressedTexSubImage3D(Pt,H,N.x,N.y,N.z,lt,mt,St,wt,oe.data)):z.texSubImage3D(Pt,H,N.x,N.y,N.z,lt,mt,St,wt,zt,oe),z.pixelStorei(z.UNPACK_ROW_LENGTH,Ut),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,he),z.pixelStorei(z.UNPACK_SKIP_PIXELS,Be),z.pixelStorei(z.UNPACK_SKIP_ROWS,xe),z.pixelStorei(z.UNPACK_SKIP_IMAGES,gn),H===0&&k.generateMipmaps&&z.generateMipmap(Pt),dt.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?C.setTextureCube(w,0):w.isData3DTexture?C.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?C.setTexture2DArray(w,0):C.setTexture2D(w,0),dt.unbindTexture()},this.resetState=function(){y=0,A=0,T=null,dt.reset(),Ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===ca?"display-p3":"srgb",e.unpackColorSpace=Jt.workingColorSpace===Nr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Me?ri:Bl}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===ri?Me:Cn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class k_ extends Ko{}k_.prototype.isWebGL1Renderer=!0;class rh extends Ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class oh extends Ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}const So=new Kt,qc=new L,Zc=new L;class W_{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new kt(512,512),this.map=null,this.mapPass=null,this.matrix=new Kt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fa,this._frameExtents=new kt(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;qc.setFromMatrixPosition(t.matrixWorld),e.position.copy(qc),Zc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Zc),e.updateMatrixWorld(),So.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(So),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(So)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class X_ extends W_{constructor(){super(new Jl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Y_ extends oh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.shadow=new X_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class q_ extends oh{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Z_{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Kc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Kc();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Kc(){return(typeof performance>"u"?Date:performance).now()}class K_{constructor(t,e,n=0,s=1/0){this.ray=new ha(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ua,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return $o(t,this,n,e),n.sort($c),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)$o(t[s],this,n,e);return n.sort($c),n}}function $c(i,t){return i.distance-t.distance}function $o(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,a=s.length;r<a;r++)$o(s[r],t,e,!0)}}class $_{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Se(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const jc=new L,er=new L;class wn{constructor(t=new L,e=new L){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){jc.subVectors(t,this.start),er.subVectors(this.end,this.start);const n=er.dot(er);let r=er.dot(jc)/n;return e&&(r=Se(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:oa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=oa);/*!
 * camera-controls
 * https://github.com/yomotsu/camera-controls
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */const Tt={LEFT:1,RIGHT:2,MIDDLE:4},W=Object.freeze({NONE:0,ROTATE:1,TRUCK:2,OFFSET:4,DOLLY:8,ZOOM:16,TOUCH_ROTATE:32,TOUCH_TRUCK:64,TOUCH_OFFSET:128,TOUCH_DOLLY:256,TOUCH_ZOOM:512,TOUCH_DOLLY_TRUCK:1024,TOUCH_DOLLY_OFFSET:2048,TOUCH_DOLLY_ROTATE:4096,TOUCH_ZOOM_TRUCK:8192,TOUCH_ZOOM_OFFSET:16384,TOUCH_ZOOM_ROTATE:32768}),bi={NONE:0,IN:1,OUT:-1};function Jn(i){return i.isPerspectiveCamera}function Fn(i){return i.isOrthographicCamera}const wi=Math.PI*2,Jc=Math.PI/2,ah=1e-5,ls=Math.PI/180;function rn(i,t,e){return Math.max(t,Math.min(e,i))}function ne(i,t=ah){return Math.abs(i)<t}function Zt(i,t,e=ah){return ne(i-t,e)}function Qc(i,t){return Math.round(i/t)*t}function hs(i){return isFinite(i)?i:i<0?-Number.MAX_VALUE:Number.MAX_VALUE}function us(i){return Math.abs(i)<Number.MAX_VALUE?i:i*(1/0)}function nr(i,t,e,n,s=1/0,r){n=Math.max(1e-4,n);const a=2/n,o=a*r,c=1/(1+o+.48*o*o+.235*o*o*o);let l=i-t;const h=t,f=s*n;l=rn(l,-f,f),t=i-l;const u=(e.value+a*l)*r;e.value=(e.value-a*u)*c;let p=t+(l+u)*c;return h-i>0==p>h&&(p=h,e.value=(p-h)/r),p}function tl(i,t,e,n,s=1/0,r,a){n=Math.max(1e-4,n);const o=2/n,c=o*r,l=1/(1+c+.48*c*c+.235*c*c*c);let h=t.x,f=t.y,u=t.z,p=i.x-h,_=i.y-f,x=i.z-u;const m=h,d=f,M=u,v=s*n,g=v*v,y=p*p+_*_+x*x;if(y>g){const O=Math.sqrt(y);p=p/O*v,_=_/O*v,x=x/O*v}h=i.x-p,f=i.y-_,u=i.z-x;const A=(e.x+o*p)*r,T=(e.y+o*_)*r,P=(e.z+o*x)*r;e.x=(e.x-o*A)*l,e.y=(e.y-o*T)*l,e.z=(e.z-o*P)*l,a.x=h+(p+A)*l,a.y=f+(_+T)*l,a.z=u+(x+P)*l;const E=m-i.x,S=d-i.y,D=M-i.z,I=a.x-m,B=a.y-d,R=a.z-M;return E*I+S*B+D*R>0&&(a.x=m,a.y=d,a.z=M,e.x=(a.x-m)/r,e.y=(a.y-d)/r,e.z=(a.z-M)/r),a}function yo(i,t){t.set(0,0),i.forEach(e=>{t.x+=e.clientX,t.y+=e.clientY}),t.x/=i.length,t.y/=i.length}function To(i,t){return Fn(i)?(console.warn(`${t} is not supported in OrthographicCamera`),!0):!1}class j_{constructor(){this._listeners={}}addEventListener(t,e){const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}removeAllEventListeners(t){if(!t){this._listeners={};return}Array.isArray(this._listeners[t])&&(this._listeners[t].length=0)}dispatchEvent(t){const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t)}}}const J_="2.7.3",ir=1/8,ch=typeof window<"u",Q_=ch&&/Mac/.test(navigator.platform),tg=!(ch&&"PointerEvent"in window);let Mt,el,sr,Ao,Fe,Dt,Yt,Ci,fs,fn,dn,Qn,nl,il,Ye,ds,Ri,sl,bo,rl,wo,Co,rr;class Cs extends j_{static install(t){Mt=t.THREE,el=Object.freeze(new Mt.Vector3(0,0,0)),sr=Object.freeze(new Mt.Vector3(0,1,0)),Ao=Object.freeze(new Mt.Vector3(0,0,1)),Fe=new Mt.Vector2,Dt=new Mt.Vector3,Yt=new Mt.Vector3,Ci=new Mt.Vector3,fs=new Mt.Vector3,fn=new Mt.Vector3,dn=new Mt.Vector3,Qn=new Mt.Vector3,nl=new Mt.Vector3,il=new Mt.Vector3,Ye=new Mt.Spherical,ds=new Mt.Spherical,Ri=new Mt.Box3,sl=new Mt.Box3,bo=new Mt.Sphere,rl=new Mt.Quaternion,wo=new Mt.Quaternion,Co=new Mt.Matrix4,rr=new Mt.Raycaster}static get ACTION(){return W}constructor(t,e){super(),this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.minDistance=Number.EPSILON,this.maxDistance=1/0,this.infinityDolly=!1,this.minZoom=.01,this.maxZoom=1/0,this.smoothTime=.25,this.draggingSmoothTime=.125,this.maxSpeed=1/0,this.azimuthRotateSpeed=1,this.polarRotateSpeed=1,this.dollySpeed=1,this.dollyDragInverted=!1,this.truckSpeed=2,this.dollyToCursor=!1,this.dragToOffset=!1,this.verticalDragToForward=!1,this.boundaryFriction=0,this.restThreshold=.01,this.colliderMeshes=[],this.cancel=()=>{},this._enabled=!0,this._state=W.NONE,this._viewport=null,this._changedDolly=0,this._changedZoom=0,this._hasRested=!0,this._boundaryEnclosesCamera=!1,this._needsUpdate=!0,this._updatedLastTime=!1,this._elementRect=new DOMRect,this._isDragging=!1,this._dragNeedsUpdate=!0,this._activePointers=[],this._lockedPointer=null,this._interactiveArea=new DOMRect(0,0,1,1),this._isUserControllingRotate=!1,this._isUserControllingDolly=!1,this._isUserControllingTruck=!1,this._isUserControllingOffset=!1,this._isUserControllingZoom=!1,this._lastDollyDirection=bi.NONE,this._thetaVelocity={value:0},this._phiVelocity={value:0},this._radiusVelocity={value:0},this._targetVelocity=new Mt.Vector3,this._focalOffsetVelocity=new Mt.Vector3,this._zoomVelocity={value:0},this._truckInternal=(g,y,A)=>{let T,P;if(Jn(this._camera)){const E=Dt.copy(this._camera.position).sub(this._target),S=this._camera.getEffectiveFOV()*ls,D=E.length()*Math.tan(S*.5);T=this.truckSpeed*g*D/this._elementRect.height,P=this.truckSpeed*y*D/this._elementRect.height}else if(Fn(this._camera)){const E=this._camera;T=g*(E.right-E.left)/E.zoom/this._elementRect.width,P=y*(E.top-E.bottom)/E.zoom/this._elementRect.height}else return;this.verticalDragToForward?(A?this.setFocalOffset(this._focalOffsetEnd.x+T,this._focalOffsetEnd.y,this._focalOffsetEnd.z,!0):this.truck(T,0,!0),this.forward(-P,!0)):A?this.setFocalOffset(this._focalOffsetEnd.x+T,this._focalOffsetEnd.y+P,this._focalOffsetEnd.z,!0):this.truck(T,P,!0)},this._rotateInternal=(g,y)=>{const A=wi*this.azimuthRotateSpeed*g/this._elementRect.height,T=wi*this.polarRotateSpeed*y/this._elementRect.height;this.rotate(A,T,!0)},this._dollyInternal=(g,y,A)=>{const T=Math.pow(.95,-g*this.dollySpeed),P=this._sphericalEnd.radius,E=this._sphericalEnd.radius*T,S=rn(E,this.minDistance,this.maxDistance),D=S-E;this.infinityDolly&&this.dollyToCursor?this._dollyToNoClamp(E,!0):this.infinityDolly&&!this.dollyToCursor?(this.dollyInFixed(D,!0),this._dollyToNoClamp(S,!0)):this._dollyToNoClamp(S,!0),this.dollyToCursor&&(this._changedDolly+=(this.infinityDolly?E:S)-P,this._dollyControlCoord.set(y,A)),this._lastDollyDirection=Math.sign(-g)},this._zoomInternal=(g,y,A)=>{const T=Math.pow(.95,g*this.dollySpeed),P=this._zoom,E=this._zoom*T;this.zoomTo(E,!0),this.dollyToCursor&&(this._changedZoom+=E-P,this._dollyControlCoord.set(y,A))},typeof Mt>"u"&&console.error("camera-controls: `THREE` is undefined. You must first run `CameraControls.install( { THREE: THREE } )`. Check the docs for further information."),this._camera=t,this._yAxisUpSpace=new Mt.Quaternion().setFromUnitVectors(this._camera.up,sr),this._yAxisUpSpaceInverse=this._yAxisUpSpace.clone().invert(),this._state=W.NONE,this._target=new Mt.Vector3,this._targetEnd=this._target.clone(),this._focalOffset=new Mt.Vector3,this._focalOffsetEnd=this._focalOffset.clone(),this._spherical=new Mt.Spherical().setFromVector3(Dt.copy(this._camera.position).applyQuaternion(this._yAxisUpSpace)),this._sphericalEnd=this._spherical.clone(),this._lastDistance=this._spherical.radius,this._zoom=this._camera.zoom,this._zoomEnd=this._zoom,this._lastZoom=this._zoom,this._nearPlaneCorners=[new Mt.Vector3,new Mt.Vector3,new Mt.Vector3,new Mt.Vector3],this._updateNearPlaneCorners(),this._boundary=new Mt.Box3(new Mt.Vector3(-1/0,-1/0,-1/0),new Mt.Vector3(1/0,1/0,1/0)),this._cameraUp0=this._camera.up.clone(),this._target0=this._target.clone(),this._position0=this._camera.position.clone(),this._zoom0=this._zoom,this._focalOffset0=this._focalOffset.clone(),this._dollyControlCoord=new Mt.Vector2,this.mouseButtons={left:W.ROTATE,middle:W.DOLLY,right:W.TRUCK,wheel:Jn(this._camera)?W.DOLLY:Fn(this._camera)?W.ZOOM:W.NONE},this.touches={one:W.TOUCH_ROTATE,two:Jn(this._camera)?W.TOUCH_DOLLY_TRUCK:Fn(this._camera)?W.TOUCH_ZOOM_TRUCK:W.NONE,three:W.TOUCH_TRUCK};const n=new Mt.Vector2,s=new Mt.Vector2,r=new Mt.Vector2,a=g=>{if(!this._enabled||!this._domElement)return;if(this._interactiveArea.left!==0||this._interactiveArea.top!==0||this._interactiveArea.width!==1||this._interactiveArea.height!==1){const T=this._domElement.getBoundingClientRect(),P=g.clientX/T.width,E=g.clientY/T.height;if(P<this._interactiveArea.left||P>this._interactiveArea.right||E<this._interactiveArea.top||E>this._interactiveArea.bottom)return}const y=g.pointerType!=="mouse"?null:(g.buttons&Tt.LEFT)===Tt.LEFT?Tt.LEFT:(g.buttons&Tt.MIDDLE)===Tt.MIDDLE?Tt.MIDDLE:(g.buttons&Tt.RIGHT)===Tt.RIGHT?Tt.RIGHT:null;if(y!==null){const T=this._findPointerByMouseButton(y);T&&this._disposePointer(T)}if((g.buttons&Tt.LEFT)===Tt.LEFT&&this._lockedPointer)return;const A={pointerId:g.pointerId,clientX:g.clientX,clientY:g.clientY,deltaX:0,deltaY:0,mouseButton:y};this._activePointers.push(A),this._domElement.ownerDocument.removeEventListener("pointermove",c,{passive:!1}),this._domElement.ownerDocument.removeEventListener("pointerup",h),this._domElement.ownerDocument.addEventListener("pointermove",c,{passive:!1}),this._domElement.ownerDocument.addEventListener("pointerup",h),this._isDragging=!0,x(g)},o=g=>{if(!this._enabled||!this._domElement||this._lockedPointer)return;if(this._interactiveArea.left!==0||this._interactiveArea.top!==0||this._interactiveArea.width!==1||this._interactiveArea.height!==1){const T=this._domElement.getBoundingClientRect(),P=g.clientX/T.width,E=g.clientY/T.height;if(P<this._interactiveArea.left||P>this._interactiveArea.right||E<this._interactiveArea.top||E>this._interactiveArea.bottom)return}const y=(g.buttons&Tt.LEFT)===Tt.LEFT?Tt.LEFT:(g.buttons&Tt.MIDDLE)===Tt.MIDDLE?Tt.MIDDLE:(g.buttons&Tt.RIGHT)===Tt.RIGHT?Tt.RIGHT:null;if(y!==null){const T=this._findPointerByMouseButton(y);T&&this._disposePointer(T)}const A={pointerId:1,clientX:g.clientX,clientY:g.clientY,deltaX:0,deltaY:0,mouseButton:(g.buttons&Tt.LEFT)===Tt.LEFT?Tt.LEFT:(g.buttons&Tt.MIDDLE)===Tt.LEFT?Tt.MIDDLE:(g.buttons&Tt.RIGHT)===Tt.LEFT?Tt.RIGHT:null};this._activePointers.push(A),this._domElement.ownerDocument.removeEventListener("mousemove",l),this._domElement.ownerDocument.removeEventListener("mouseup",f),this._domElement.ownerDocument.addEventListener("mousemove",l),this._domElement.ownerDocument.addEventListener("mouseup",f),this._isDragging=!0,x(g)},c=g=>{g.cancelable&&g.preventDefault();const y=g.pointerId,A=this._lockedPointer||this._findPointerById(y);if(A){if(A.clientX=g.clientX,A.clientY=g.clientY,A.deltaX=g.movementX,A.deltaY=g.movementY,this._state=0,g.pointerType==="touch")switch(this._activePointers.length){case 1:this._state=this.touches.one;break;case 2:this._state=this.touches.two;break;case 3:this._state=this.touches.three;break}else(!this._isDragging&&this._lockedPointer||this._isDragging&&(g.buttons&Tt.LEFT)===Tt.LEFT)&&(this._state=this._state|this.mouseButtons.left),this._isDragging&&(g.buttons&Tt.MIDDLE)===Tt.MIDDLE&&(this._state=this._state|this.mouseButtons.middle),this._isDragging&&(g.buttons&Tt.RIGHT)===Tt.RIGHT&&(this._state=this._state|this.mouseButtons.right);m()}},l=g=>{const y=this._lockedPointer||this._findPointerById(1);y&&(y.clientX=g.clientX,y.clientY=g.clientY,y.deltaX=g.movementX,y.deltaY=g.movementY,this._state=0,(this._lockedPointer||(g.buttons&Tt.LEFT)===Tt.LEFT)&&(this._state=this._state|this.mouseButtons.left),(g.buttons&Tt.MIDDLE)===Tt.MIDDLE&&(this._state=this._state|this.mouseButtons.middle),(g.buttons&Tt.RIGHT)===Tt.RIGHT&&(this._state=this._state|this.mouseButtons.right),m())},h=g=>{const y=this._findPointerById(g.pointerId);if(!(y&&y===this._lockedPointer)){if(y&&this._disposePointer(y),g.pointerType==="touch")switch(this._activePointers.length){case 0:this._state=W.NONE;break;case 1:this._state=this.touches.one;break;case 2:this._state=this.touches.two;break;case 3:this._state=this.touches.three;break}else this._state=W.NONE;d()}},f=()=>{const g=this._findPointerById(1);g&&g===this._lockedPointer||(g&&this._disposePointer(g),this._state=W.NONE,d())};let u=-1;const p=g=>{if(!this._domElement||!this._enabled||this.mouseButtons.wheel===W.NONE)return;if(this._interactiveArea.left!==0||this._interactiveArea.top!==0||this._interactiveArea.width!==1||this._interactiveArea.height!==1){const E=this._domElement.getBoundingClientRect(),S=g.clientX/E.width,D=g.clientY/E.height;if(S<this._interactiveArea.left||S>this._interactiveArea.right||D<this._interactiveArea.top||D>this._interactiveArea.bottom)return}if(g.preventDefault(),this.dollyToCursor||this.mouseButtons.wheel===W.ROTATE||this.mouseButtons.wheel===W.TRUCK){const E=performance.now();u-E<1e3&&this._getClientRect(this._elementRect),u=E}const y=Q_?-1:-3,A=g.deltaMode===1?g.deltaY/y:g.deltaY/(y*10),T=this.dollyToCursor?(g.clientX-this._elementRect.x)/this._elementRect.width*2-1:0,P=this.dollyToCursor?(g.clientY-this._elementRect.y)/this._elementRect.height*-2+1:0;switch(this.mouseButtons.wheel){case W.ROTATE:{this._rotateInternal(g.deltaX,g.deltaY),this._isUserControllingRotate=!0;break}case W.TRUCK:{this._truckInternal(g.deltaX,g.deltaY,!1),this._isUserControllingTruck=!0;break}case W.OFFSET:{this._truckInternal(g.deltaX,g.deltaY,!0),this._isUserControllingOffset=!0;break}case W.DOLLY:{this._dollyInternal(-A,T,P),this._isUserControllingDolly=!0;break}case W.ZOOM:{this._zoomInternal(-A,T,P),this._isUserControllingZoom=!0;break}}this.dispatchEvent({type:"control"})},_=g=>{if(!(!this._domElement||!this._enabled)){if(this.mouseButtons.right===Cs.ACTION.NONE){const y=g instanceof PointerEvent?g.pointerId:(g instanceof MouseEvent,0),A=this._findPointerById(y);A&&this._disposePointer(A),this._domElement.ownerDocument.removeEventListener("pointermove",c,{passive:!1}),this._domElement.ownerDocument.removeEventListener("pointerup",h),this._domElement.ownerDocument.removeEventListener("mousemove",l),this._domElement.ownerDocument.removeEventListener("mouseup",f);return}g.preventDefault()}},x=g=>{if(!this._enabled)return;if(yo(this._activePointers,Fe),this._getClientRect(this._elementRect),n.copy(Fe),s.copy(Fe),this._activePointers.length>=2){const A=Fe.x-this._activePointers[1].clientX,T=Fe.y-this._activePointers[1].clientY,P=Math.sqrt(A*A+T*T);r.set(0,P);const E=(this._activePointers[0].clientX+this._activePointers[1].clientX)*.5,S=(this._activePointers[0].clientY+this._activePointers[1].clientY)*.5;s.set(E,S)}if(this._state=0,!g)this._lockedPointer&&(this._state=this._state|this.mouseButtons.left);else if("pointerType"in g&&g.pointerType==="touch")switch(this._activePointers.length){case 1:this._state=this.touches.one;break;case 2:this._state=this.touches.two;break;case 3:this._state=this.touches.three;break}else!this._lockedPointer&&(g.buttons&Tt.LEFT)===Tt.LEFT&&(this._state=this._state|this.mouseButtons.left),(g.buttons&Tt.MIDDLE)===Tt.MIDDLE&&(this._state=this._state|this.mouseButtons.middle),(g.buttons&Tt.RIGHT)===Tt.RIGHT&&(this._state=this._state|this.mouseButtons.right);((this._state&W.ROTATE)===W.ROTATE||(this._state&W.TOUCH_ROTATE)===W.TOUCH_ROTATE||(this._state&W.TOUCH_DOLLY_ROTATE)===W.TOUCH_DOLLY_ROTATE||(this._state&W.TOUCH_ZOOM_ROTATE)===W.TOUCH_ZOOM_ROTATE)&&(this._sphericalEnd.theta=this._spherical.theta,this._sphericalEnd.phi=this._spherical.phi,this._thetaVelocity.value=0,this._phiVelocity.value=0),((this._state&W.TRUCK)===W.TRUCK||(this._state&W.TOUCH_TRUCK)===W.TOUCH_TRUCK||(this._state&W.TOUCH_DOLLY_TRUCK)===W.TOUCH_DOLLY_TRUCK||(this._state&W.TOUCH_ZOOM_TRUCK)===W.TOUCH_ZOOM_TRUCK)&&(this._targetEnd.copy(this._target),this._targetVelocity.set(0,0,0)),((this._state&W.DOLLY)===W.DOLLY||(this._state&W.TOUCH_DOLLY)===W.TOUCH_DOLLY||(this._state&W.TOUCH_DOLLY_TRUCK)===W.TOUCH_DOLLY_TRUCK||(this._state&W.TOUCH_DOLLY_OFFSET)===W.TOUCH_DOLLY_OFFSET||(this._state&W.TOUCH_DOLLY_ROTATE)===W.TOUCH_DOLLY_ROTATE)&&(this._sphericalEnd.radius=this._spherical.radius,this._radiusVelocity.value=0),((this._state&W.ZOOM)===W.ZOOM||(this._state&W.TOUCH_ZOOM)===W.TOUCH_ZOOM||(this._state&W.TOUCH_ZOOM_TRUCK)===W.TOUCH_ZOOM_TRUCK||(this._state&W.TOUCH_ZOOM_OFFSET)===W.TOUCH_ZOOM_OFFSET||(this._state&W.TOUCH_ZOOM_ROTATE)===W.TOUCH_ZOOM_ROTATE)&&(this._zoomEnd=this._zoom,this._zoomVelocity.value=0),((this._state&W.OFFSET)===W.OFFSET||(this._state&W.TOUCH_OFFSET)===W.TOUCH_OFFSET||(this._state&W.TOUCH_DOLLY_OFFSET)===W.TOUCH_DOLLY_OFFSET||(this._state&W.TOUCH_ZOOM_OFFSET)===W.TOUCH_ZOOM_OFFSET)&&(this._focalOffsetEnd.copy(this._focalOffset),this._focalOffsetVelocity.set(0,0,0)),this.dispatchEvent({type:"controlstart"})},m=()=>{if(!this._enabled||!this._dragNeedsUpdate)return;this._dragNeedsUpdate=!1,yo(this._activePointers,Fe);const y=this._domElement&&document.pointerLockElement===this._domElement?this._lockedPointer||this._activePointers[0]:null,A=y?-y.deltaX:s.x-Fe.x,T=y?-y.deltaY:s.y-Fe.y;if(s.copy(Fe),((this._state&W.ROTATE)===W.ROTATE||(this._state&W.TOUCH_ROTATE)===W.TOUCH_ROTATE||(this._state&W.TOUCH_DOLLY_ROTATE)===W.TOUCH_DOLLY_ROTATE||(this._state&W.TOUCH_ZOOM_ROTATE)===W.TOUCH_ZOOM_ROTATE)&&(this._rotateInternal(A,T),this._isUserControllingRotate=!0),(this._state&W.DOLLY)===W.DOLLY||(this._state&W.ZOOM)===W.ZOOM){const P=this.dollyToCursor?(n.x-this._elementRect.x)/this._elementRect.width*2-1:0,E=this.dollyToCursor?(n.y-this._elementRect.y)/this._elementRect.height*-2+1:0,S=this.dollyDragInverted?-1:1;(this._state&W.DOLLY)===W.DOLLY?(this._dollyInternal(S*T*ir,P,E),this._isUserControllingDolly=!0):(this._zoomInternal(S*T*ir,P,E),this._isUserControllingZoom=!0)}if((this._state&W.TOUCH_DOLLY)===W.TOUCH_DOLLY||(this._state&W.TOUCH_ZOOM)===W.TOUCH_ZOOM||(this._state&W.TOUCH_DOLLY_TRUCK)===W.TOUCH_DOLLY_TRUCK||(this._state&W.TOUCH_ZOOM_TRUCK)===W.TOUCH_ZOOM_TRUCK||(this._state&W.TOUCH_DOLLY_OFFSET)===W.TOUCH_DOLLY_OFFSET||(this._state&W.TOUCH_ZOOM_OFFSET)===W.TOUCH_ZOOM_OFFSET||(this._state&W.TOUCH_DOLLY_ROTATE)===W.TOUCH_DOLLY_ROTATE||(this._state&W.TOUCH_ZOOM_ROTATE)===W.TOUCH_ZOOM_ROTATE){const P=Fe.x-this._activePointers[1].clientX,E=Fe.y-this._activePointers[1].clientY,S=Math.sqrt(P*P+E*E),D=r.y-S;r.set(0,S);const I=this.dollyToCursor?(s.x-this._elementRect.x)/this._elementRect.width*2-1:0,B=this.dollyToCursor?(s.y-this._elementRect.y)/this._elementRect.height*-2+1:0;(this._state&W.TOUCH_DOLLY)===W.TOUCH_DOLLY||(this._state&W.TOUCH_DOLLY_ROTATE)===W.TOUCH_DOLLY_ROTATE||(this._state&W.TOUCH_DOLLY_TRUCK)===W.TOUCH_DOLLY_TRUCK||(this._state&W.TOUCH_DOLLY_OFFSET)===W.TOUCH_DOLLY_OFFSET?(this._dollyInternal(D*ir,I,B),this._isUserControllingDolly=!0):(this._zoomInternal(D*ir,I,B),this._isUserControllingZoom=!0)}((this._state&W.TRUCK)===W.TRUCK||(this._state&W.TOUCH_TRUCK)===W.TOUCH_TRUCK||(this._state&W.TOUCH_DOLLY_TRUCK)===W.TOUCH_DOLLY_TRUCK||(this._state&W.TOUCH_ZOOM_TRUCK)===W.TOUCH_ZOOM_TRUCK)&&(this._truckInternal(A,T,!1),this._isUserControllingTruck=!0),((this._state&W.OFFSET)===W.OFFSET||(this._state&W.TOUCH_OFFSET)===W.TOUCH_OFFSET||(this._state&W.TOUCH_DOLLY_OFFSET)===W.TOUCH_DOLLY_OFFSET||(this._state&W.TOUCH_ZOOM_OFFSET)===W.TOUCH_ZOOM_OFFSET)&&(this._truckInternal(A,T,!0),this._isUserControllingOffset=!0),this.dispatchEvent({type:"control"})},d=()=>{yo(this._activePointers,Fe),s.copy(Fe),this._dragNeedsUpdate=!1,(this._activePointers.length===0||this._activePointers.length===1&&this._activePointers[0]===this._lockedPointer)&&(this._isDragging=!1),this._activePointers.length===0&&this._domElement&&(this._domElement.ownerDocument.removeEventListener("pointermove",c,{passive:!1}),this._domElement.ownerDocument.removeEventListener("mousemove",l),this._domElement.ownerDocument.removeEventListener("pointerup",h),this._domElement.ownerDocument.removeEventListener("mouseup",f),this.dispatchEvent({type:"controlend"}))};this.lockPointer=()=>{!this._enabled||!this._domElement||(this.cancel(),this._lockedPointer={pointerId:-1,clientX:0,clientY:0,deltaX:0,deltaY:0,mouseButton:null},this._activePointers.push(this._lockedPointer),this._domElement.ownerDocument.removeEventListener("pointermove",c,{passive:!1}),this._domElement.ownerDocument.removeEventListener("pointerup",h),this._domElement.requestPointerLock(),this._domElement.ownerDocument.addEventListener("pointerlockchange",M),this._domElement.ownerDocument.addEventListener("pointerlockerror",v),this._domElement.ownerDocument.addEventListener("pointermove",c,{passive:!1}),this._domElement.ownerDocument.addEventListener("pointerup",h),x())},this.unlockPointer=()=>{this._lockedPointer!==null&&(this._disposePointer(this._lockedPointer),this._lockedPointer=null),document.exitPointerLock(),this.cancel(),this._domElement&&(this._domElement.ownerDocument.removeEventListener("pointerlockchange",M),this._domElement.ownerDocument.removeEventListener("pointerlockerror",v))};const M=()=>{this._domElement&&this._domElement.ownerDocument.pointerLockElement===this._domElement||this.unlockPointer()},v=()=>{this.unlockPointer()};this._addAllEventListeners=g=>{this._domElement=g,this._domElement.style.touchAction="none",this._domElement.style.userSelect="none",this._domElement.style.webkitUserSelect="none",this._domElement.addEventListener("pointerdown",a),tg&&this._domElement.addEventListener("mousedown",o),this._domElement.addEventListener("pointercancel",h),this._domElement.addEventListener("wheel",p,{passive:!1}),this._domElement.addEventListener("contextmenu",_)},this._removeAllEventListeners=()=>{this._domElement&&(this._domElement.style.touchAction="",this._domElement.style.userSelect="",this._domElement.style.webkitUserSelect="",this._domElement.removeEventListener("pointerdown",a),this._domElement.removeEventListener("mousedown",o),this._domElement.removeEventListener("pointercancel",h),this._domElement.removeEventListener("wheel",p,{passive:!1}),this._domElement.removeEventListener("contextmenu",_),this._domElement.ownerDocument.removeEventListener("pointermove",c,{passive:!1}),this._domElement.ownerDocument.removeEventListener("mousemove",l),this._domElement.ownerDocument.removeEventListener("pointerup",h),this._domElement.ownerDocument.removeEventListener("mouseup",f),this._domElement.ownerDocument.removeEventListener("pointerlockchange",M),this._domElement.ownerDocument.removeEventListener("pointerlockerror",v))},this.cancel=()=>{this._state!==W.NONE&&(this._state=W.NONE,this._activePointers.length=0,d())},e&&this.connect(e),this.update(0)}get camera(){return this._camera}set camera(t){this._camera=t,this.updateCameraUp(),this._camera.updateProjectionMatrix(),this._updateNearPlaneCorners(),this._needsUpdate=!0}get enabled(){return this._enabled}set enabled(t){this._enabled=t,this._domElement&&(t?(this._domElement.style.touchAction="none",this._domElement.style.userSelect="none",this._domElement.style.webkitUserSelect="none"):(this.cancel(),this._domElement.style.touchAction="",this._domElement.style.userSelect="",this._domElement.style.webkitUserSelect=""))}get active(){return!this._hasRested}get currentAction(){return this._state}get distance(){return this._spherical.radius}set distance(t){this._spherical.radius===t&&this._sphericalEnd.radius===t||(this._spherical.radius=t,this._sphericalEnd.radius=t,this._needsUpdate=!0)}get azimuthAngle(){return this._spherical.theta}set azimuthAngle(t){this._spherical.theta===t&&this._sphericalEnd.theta===t||(this._spherical.theta=t,this._sphericalEnd.theta=t,this._needsUpdate=!0)}get polarAngle(){return this._spherical.phi}set polarAngle(t){this._spherical.phi===t&&this._sphericalEnd.phi===t||(this._spherical.phi=t,this._sphericalEnd.phi=t,this._needsUpdate=!0)}get boundaryEnclosesCamera(){return this._boundaryEnclosesCamera}set boundaryEnclosesCamera(t){this._boundaryEnclosesCamera=t,this._needsUpdate=!0}set interactiveArea(t){this._interactiveArea.width=rn(t.width,0,1),this._interactiveArea.height=rn(t.height,0,1),this._interactiveArea.x=rn(t.x,0,1-this._interactiveArea.width),this._interactiveArea.y=rn(t.y,0,1-this._interactiveArea.height)}addEventListener(t,e){super.addEventListener(t,e)}removeEventListener(t,e){super.removeEventListener(t,e)}rotate(t,e,n=!1){return this.rotateTo(this._sphericalEnd.theta+t,this._sphericalEnd.phi+e,n)}rotateAzimuthTo(t,e=!1){return this.rotateTo(t,this._sphericalEnd.phi,e)}rotatePolarTo(t,e=!1){return this.rotateTo(this._sphericalEnd.theta,t,e)}rotateTo(t,e,n=!1){this._isUserControllingRotate=!1;const s=rn(t,this.minAzimuthAngle,this.maxAzimuthAngle),r=rn(e,this.minPolarAngle,this.maxPolarAngle);this._sphericalEnd.theta=s,this._sphericalEnd.phi=r,this._sphericalEnd.makeSafe(),this._needsUpdate=!0,n||(this._spherical.theta=this._sphericalEnd.theta,this._spherical.phi=this._sphericalEnd.phi);const a=!n||Zt(this._spherical.theta,this._sphericalEnd.theta,this.restThreshold)&&Zt(this._spherical.phi,this._sphericalEnd.phi,this.restThreshold);return this._createOnRestPromise(a)}dolly(t,e=!1){return this.dollyTo(this._sphericalEnd.radius-t,e)}dollyTo(t,e=!1){return this._isUserControllingDolly=!1,this._lastDollyDirection=bi.NONE,this._changedDolly=0,this._dollyToNoClamp(rn(t,this.minDistance,this.maxDistance),e)}_dollyToNoClamp(t,e=!1){const n=this._sphericalEnd.radius;if(this.colliderMeshes.length>=1){const a=this._collisionTest(),o=Zt(a,this._spherical.radius);if(!(n>t)&&o)return Promise.resolve();this._sphericalEnd.radius=Math.min(t,a)}else this._sphericalEnd.radius=t;this._needsUpdate=!0,e||(this._spherical.radius=this._sphericalEnd.radius);const r=!e||Zt(this._spherical.radius,this._sphericalEnd.radius,this.restThreshold);return this._createOnRestPromise(r)}dollyInFixed(t,e=!1){this._targetEnd.add(this._getCameraDirection(fs).multiplyScalar(t)),e||this._target.copy(this._targetEnd);const n=!e||Zt(this._target.x,this._targetEnd.x,this.restThreshold)&&Zt(this._target.y,this._targetEnd.y,this.restThreshold)&&Zt(this._target.z,this._targetEnd.z,this.restThreshold);return this._createOnRestPromise(n)}zoom(t,e=!1){return this.zoomTo(this._zoomEnd+t,e)}zoomTo(t,e=!1){this._isUserControllingZoom=!1,this._zoomEnd=rn(t,this.minZoom,this.maxZoom),this._needsUpdate=!0,e||(this._zoom=this._zoomEnd);const n=!e||Zt(this._zoom,this._zoomEnd,this.restThreshold);return this._changedZoom=0,this._createOnRestPromise(n)}pan(t,e,n=!1){return console.warn("`pan` has been renamed to `truck`"),this.truck(t,e,n)}truck(t,e,n=!1){this._camera.updateMatrix(),fn.setFromMatrixColumn(this._camera.matrix,0),dn.setFromMatrixColumn(this._camera.matrix,1),fn.multiplyScalar(t),dn.multiplyScalar(-e);const s=Dt.copy(fn).add(dn),r=Yt.copy(this._targetEnd).add(s);return this.moveTo(r.x,r.y,r.z,n)}forward(t,e=!1){Dt.setFromMatrixColumn(this._camera.matrix,0),Dt.crossVectors(this._camera.up,Dt),Dt.multiplyScalar(t);const n=Yt.copy(this._targetEnd).add(Dt);return this.moveTo(n.x,n.y,n.z,e)}elevate(t,e=!1){return Dt.copy(this._camera.up).multiplyScalar(t),this.moveTo(this._targetEnd.x+Dt.x,this._targetEnd.y+Dt.y,this._targetEnd.z+Dt.z,e)}moveTo(t,e,n,s=!1){this._isUserControllingTruck=!1;const r=Dt.set(t,e,n).sub(this._targetEnd);this._encloseToBoundary(this._targetEnd,r,this.boundaryFriction),this._needsUpdate=!0,s||this._target.copy(this._targetEnd);const a=!s||Zt(this._target.x,this._targetEnd.x,this.restThreshold)&&Zt(this._target.y,this._targetEnd.y,this.restThreshold)&&Zt(this._target.z,this._targetEnd.z,this.restThreshold);return this._createOnRestPromise(a)}lookInDirectionOf(t,e,n,s=!1){const o=Dt.set(t,e,n).sub(this._targetEnd).normalize().multiplyScalar(-this._sphericalEnd.radius);return this.setPosition(o.x,o.y,o.z,s)}fitToBox(t,e,{cover:n=!1,paddingLeft:s=0,paddingRight:r=0,paddingBottom:a=0,paddingTop:o=0}={}){const c=[],l=t.isBox3?Ri.copy(t):Ri.setFromObject(t);l.isEmpty()&&(console.warn("camera-controls: fitTo() cannot be used with an empty box. Aborting"),Promise.resolve());const h=Qc(this._sphericalEnd.theta,Jc),f=Qc(this._sphericalEnd.phi,Jc);c.push(this.rotateTo(h,f,e));const u=Dt.setFromSpherical(this._sphericalEnd).normalize(),p=rl.setFromUnitVectors(u,Ao),_=Zt(Math.abs(u.y),1);_&&p.multiply(wo.setFromAxisAngle(sr,h)),p.multiply(this._yAxisUpSpaceInverse);const x=sl.makeEmpty();Yt.copy(l.min).applyQuaternion(p),x.expandByPoint(Yt),Yt.copy(l.min).setX(l.max.x).applyQuaternion(p),x.expandByPoint(Yt),Yt.copy(l.min).setY(l.max.y).applyQuaternion(p),x.expandByPoint(Yt),Yt.copy(l.max).setZ(l.min.z).applyQuaternion(p),x.expandByPoint(Yt),Yt.copy(l.min).setZ(l.max.z).applyQuaternion(p),x.expandByPoint(Yt),Yt.copy(l.max).setY(l.min.y).applyQuaternion(p),x.expandByPoint(Yt),Yt.copy(l.max).setX(l.min.x).applyQuaternion(p),x.expandByPoint(Yt),Yt.copy(l.max).applyQuaternion(p),x.expandByPoint(Yt),x.min.x-=s,x.min.y-=a,x.max.x+=r,x.max.y+=o,p.setFromUnitVectors(Ao,u),_&&p.premultiply(wo.invert()),p.premultiply(this._yAxisUpSpace);const m=x.getSize(Dt),d=x.getCenter(Yt).applyQuaternion(p);if(Jn(this._camera)){const M=this.getDistanceToFitBox(m.x,m.y,m.z,n);c.push(this.moveTo(d.x,d.y,d.z,e)),c.push(this.dollyTo(M,e)),c.push(this.setFocalOffset(0,0,0,e))}else if(Fn(this._camera)){const M=this._camera,v=M.right-M.left,g=M.top-M.bottom,y=n?Math.max(v/m.x,g/m.y):Math.min(v/m.x,g/m.y);c.push(this.moveTo(d.x,d.y,d.z,e)),c.push(this.zoomTo(y,e)),c.push(this.setFocalOffset(0,0,0,e))}return Promise.all(c)}fitToSphere(t,e){const n=[],r=t instanceof Mt.Sphere?bo.copy(t):Cs.createBoundingSphere(t,bo);if(n.push(this.moveTo(r.center.x,r.center.y,r.center.z,e)),Jn(this._camera)){const a=this.getDistanceToFitSphere(r.radius);n.push(this.dollyTo(a,e))}else if(Fn(this._camera)){const a=this._camera.right-this._camera.left,o=this._camera.top-this._camera.bottom,c=2*r.radius,l=Math.min(a/c,o/c);n.push(this.zoomTo(l,e))}return n.push(this.setFocalOffset(0,0,0,e)),Promise.all(n)}setLookAt(t,e,n,s,r,a,o=!1){this._isUserControllingRotate=!1,this._isUserControllingDolly=!1,this._isUserControllingTruck=!1,this._lastDollyDirection=bi.NONE,this._changedDolly=0;const c=Yt.set(s,r,a),l=Dt.set(t,e,n);this._targetEnd.copy(c),this._sphericalEnd.setFromVector3(l.sub(c).applyQuaternion(this._yAxisUpSpace)),this.normalizeRotations(),this._needsUpdate=!0,o||(this._target.copy(this._targetEnd),this._spherical.copy(this._sphericalEnd));const h=!o||Zt(this._target.x,this._targetEnd.x,this.restThreshold)&&Zt(this._target.y,this._targetEnd.y,this.restThreshold)&&Zt(this._target.z,this._targetEnd.z,this.restThreshold)&&Zt(this._spherical.theta,this._sphericalEnd.theta,this.restThreshold)&&Zt(this._spherical.phi,this._sphericalEnd.phi,this.restThreshold)&&Zt(this._spherical.radius,this._sphericalEnd.radius,this.restThreshold);return this._createOnRestPromise(h)}lerpLookAt(t,e,n,s,r,a,o,c,l,h,f,u,p,_=!1){this._isUserControllingRotate=!1,this._isUserControllingDolly=!1,this._isUserControllingTruck=!1,this._lastDollyDirection=bi.NONE,this._changedDolly=0;const x=Dt.set(s,r,a),m=Yt.set(t,e,n);Ye.setFromVector3(m.sub(x).applyQuaternion(this._yAxisUpSpace));const d=Ci.set(h,f,u),M=Yt.set(o,c,l);ds.setFromVector3(M.sub(d).applyQuaternion(this._yAxisUpSpace)),this._targetEnd.copy(x.lerp(d,p));const v=ds.theta-Ye.theta,g=ds.phi-Ye.phi,y=ds.radius-Ye.radius;this._sphericalEnd.set(Ye.radius+y*p,Ye.phi+g*p,Ye.theta+v*p),this.normalizeRotations(),this._needsUpdate=!0,_||(this._target.copy(this._targetEnd),this._spherical.copy(this._sphericalEnd));const A=!_||Zt(this._target.x,this._targetEnd.x,this.restThreshold)&&Zt(this._target.y,this._targetEnd.y,this.restThreshold)&&Zt(this._target.z,this._targetEnd.z,this.restThreshold)&&Zt(this._spherical.theta,this._sphericalEnd.theta,this.restThreshold)&&Zt(this._spherical.phi,this._sphericalEnd.phi,this.restThreshold)&&Zt(this._spherical.radius,this._sphericalEnd.radius,this.restThreshold);return this._createOnRestPromise(A)}setPosition(t,e,n,s=!1){return this.setLookAt(t,e,n,this._targetEnd.x,this._targetEnd.y,this._targetEnd.z,s)}setTarget(t,e,n,s=!1){const r=this.getPosition(Dt),a=this.setLookAt(r.x,r.y,r.z,t,e,n,s);return this._sphericalEnd.phi=rn(this._sphericalEnd.phi,this.minPolarAngle,this.maxPolarAngle),a}setFocalOffset(t,e,n,s=!1){this._isUserControllingOffset=!1,this._focalOffsetEnd.set(t,e,n),this._needsUpdate=!0,s||this._focalOffset.copy(this._focalOffsetEnd);const r=!s||Zt(this._focalOffset.x,this._focalOffsetEnd.x,this.restThreshold)&&Zt(this._focalOffset.y,this._focalOffsetEnd.y,this.restThreshold)&&Zt(this._focalOffset.z,this._focalOffsetEnd.z,this.restThreshold);return this._createOnRestPromise(r)}setOrbitPoint(t,e,n){this._camera.updateMatrixWorld(),fn.setFromMatrixColumn(this._camera.matrixWorldInverse,0),dn.setFromMatrixColumn(this._camera.matrixWorldInverse,1),Qn.setFromMatrixColumn(this._camera.matrixWorldInverse,2);const s=Dt.set(t,e,n),r=s.distanceTo(this._camera.position),a=s.sub(this._camera.position);fn.multiplyScalar(a.x),dn.multiplyScalar(a.y),Qn.multiplyScalar(a.z),Dt.copy(fn).add(dn).add(Qn),Dt.z=Dt.z+r,this.dollyTo(r,!1),this.setFocalOffset(-Dt.x,Dt.y,-Dt.z,!1),this.moveTo(t,e,n,!1)}setBoundary(t){if(!t){this._boundary.min.set(-1/0,-1/0,-1/0),this._boundary.max.set(1/0,1/0,1/0),this._needsUpdate=!0;return}this._boundary.copy(t),this._boundary.clampPoint(this._targetEnd,this._targetEnd),this._needsUpdate=!0}setViewport(t,e,n,s){if(t===null){this._viewport=null;return}this._viewport=this._viewport||new Mt.Vector4,typeof t=="number"?this._viewport.set(t,e,n,s):this._viewport.copy(t)}getDistanceToFitBox(t,e,n,s=!1){if(To(this._camera,"getDistanceToFitBox"))return this._spherical.radius;const r=t/e,a=this._camera.getEffectiveFOV()*ls,o=this._camera.aspect;return((s?r>o:r<o)?e:t/o)*.5/Math.tan(a*.5)+n*.5}getDistanceToFitSphere(t){if(To(this._camera,"getDistanceToFitSphere"))return this._spherical.radius;const e=this._camera.getEffectiveFOV()*ls,n=Math.atan(Math.tan(e*.5)*this._camera.aspect)*2,s=1<this._camera.aspect?e:n;return t/Math.sin(s*.5)}getTarget(t,e=!0){return(t&&t.isVector3?t:new Mt.Vector3).copy(e?this._targetEnd:this._target)}getPosition(t,e=!0){return(t&&t.isVector3?t:new Mt.Vector3).setFromSpherical(e?this._sphericalEnd:this._spherical).applyQuaternion(this._yAxisUpSpaceInverse).add(e?this._targetEnd:this._target)}getSpherical(t,e=!0){return(t&&t instanceof Mt.Spherical?t:new Mt.Spherical).copy(e?this._sphericalEnd:this._spherical)}getFocalOffset(t,e=!0){return(t&&t.isVector3?t:new Mt.Vector3).copy(e?this._focalOffsetEnd:this._focalOffset)}normalizeRotations(){this._sphericalEnd.theta=this._sphericalEnd.theta%wi,this._sphericalEnd.theta<0&&(this._sphericalEnd.theta+=wi),this._spherical.theta+=wi*Math.round((this._sphericalEnd.theta-this._spherical.theta)/wi)}reset(t=!1){if(!Zt(this._camera.up.x,this._cameraUp0.x)||!Zt(this._camera.up.y,this._cameraUp0.y)||!Zt(this._camera.up.z,this._cameraUp0.z)){this._camera.up.copy(this._cameraUp0);const n=this.getPosition(Dt);this.updateCameraUp(),this.setPosition(n.x,n.y,n.z)}const e=[this.setLookAt(this._position0.x,this._position0.y,this._position0.z,this._target0.x,this._target0.y,this._target0.z,t),this.setFocalOffset(this._focalOffset0.x,this._focalOffset0.y,this._focalOffset0.z,t),this.zoomTo(this._zoom0,t)];return Promise.all(e)}saveState(){this._cameraUp0.copy(this._camera.up),this.getTarget(this._target0),this.getPosition(this._position0),this._zoom0=this._zoom,this._focalOffset0.copy(this._focalOffset)}updateCameraUp(){this._yAxisUpSpace.setFromUnitVectors(this._camera.up,sr),this._yAxisUpSpaceInverse.copy(this._yAxisUpSpace).invert()}applyCameraUp(){const t=Dt.subVectors(this._target,this._camera.position).normalize(),e=Yt.crossVectors(t,this._camera.up);this._camera.up.crossVectors(e,t).normalize(),this._camera.updateMatrixWorld();const n=this.getPosition(Dt);this.updateCameraUp(),this.setPosition(n.x,n.y,n.z)}update(t){const e=this._sphericalEnd.theta-this._spherical.theta,n=this._sphericalEnd.phi-this._spherical.phi,s=this._sphericalEnd.radius-this._spherical.radius,r=nl.subVectors(this._targetEnd,this._target),a=il.subVectors(this._focalOffsetEnd,this._focalOffset),o=this._zoomEnd-this._zoom;if(ne(e))this._thetaVelocity.value=0,this._spherical.theta=this._sphericalEnd.theta;else{const f=this._isUserControllingRotate?this.draggingSmoothTime:this.smoothTime;this._spherical.theta=nr(this._spherical.theta,this._sphericalEnd.theta,this._thetaVelocity,f,1/0,t),this._needsUpdate=!0}if(ne(n))this._phiVelocity.value=0,this._spherical.phi=this._sphericalEnd.phi;else{const f=this._isUserControllingRotate?this.draggingSmoothTime:this.smoothTime;this._spherical.phi=nr(this._spherical.phi,this._sphericalEnd.phi,this._phiVelocity,f,1/0,t),this._needsUpdate=!0}if(ne(s))this._radiusVelocity.value=0,this._spherical.radius=this._sphericalEnd.radius;else{const f=this._isUserControllingDolly?this.draggingSmoothTime:this.smoothTime;this._spherical.radius=nr(this._spherical.radius,this._sphericalEnd.radius,this._radiusVelocity,f,this.maxSpeed,t),this._needsUpdate=!0}if(ne(r.x)&&ne(r.y)&&ne(r.z))this._targetVelocity.set(0,0,0),this._target.copy(this._targetEnd);else{const f=this._isUserControllingTruck?this.draggingSmoothTime:this.smoothTime;tl(this._target,this._targetEnd,this._targetVelocity,f,this.maxSpeed,t,this._target),this._needsUpdate=!0}if(ne(a.x)&&ne(a.y)&&ne(a.z))this._focalOffsetVelocity.set(0,0,0),this._focalOffset.copy(this._focalOffsetEnd);else{const f=this._isUserControllingOffset?this.draggingSmoothTime:this.smoothTime;tl(this._focalOffset,this._focalOffsetEnd,this._focalOffsetVelocity,f,this.maxSpeed,t,this._focalOffset),this._needsUpdate=!0}if(ne(o))this._zoomVelocity.value=0,this._zoom=this._zoomEnd;else{const f=this._isUserControllingZoom?this.draggingSmoothTime:this.smoothTime;this._zoom=nr(this._zoom,this._zoomEnd,this._zoomVelocity,f,1/0,t)}if(this.dollyToCursor){if(Jn(this._camera)&&this._changedDolly!==0){const f=this._spherical.radius-this._lastDistance,u=this._camera,p=this._getCameraDirection(fs),_=Dt.copy(p).cross(u.up).normalize();_.lengthSq()===0&&(_.x=1);const x=Yt.crossVectors(_,p),m=this._sphericalEnd.radius*Math.tan(u.getEffectiveFOV()*ls*.5),M=(this._sphericalEnd.radius-f-this._sphericalEnd.radius)/this._sphericalEnd.radius,v=Ci.copy(this._targetEnd).add(_.multiplyScalar(this._dollyControlCoord.x*m*u.aspect)).add(x.multiplyScalar(this._dollyControlCoord.y*m)),g=Dt.copy(this._targetEnd).lerp(v,M),y=this._lastDollyDirection===bi.IN&&this._spherical.radius<=this.minDistance,A=this._lastDollyDirection===bi.OUT&&this.maxDistance<=this._spherical.radius;if(this.infinityDolly&&(y||A)){this._sphericalEnd.radius-=f,this._spherical.radius-=f;const P=Yt.copy(p).multiplyScalar(-f);g.add(P)}this._boundary.clampPoint(g,g);const T=Yt.subVectors(g,this._targetEnd);this._targetEnd.copy(g),this._target.add(T),this._changedDolly-=f,ne(this._changedDolly)&&(this._changedDolly=0)}else if(Fn(this._camera)&&this._changedZoom!==0){const f=this._zoom-this._lastZoom,u=this._camera,p=Dt.set(this._dollyControlCoord.x,this._dollyControlCoord.y,(u.near+u.far)/(u.near-u.far)).unproject(u),_=Yt.set(0,0,-1).applyQuaternion(u.quaternion),x=Ci.copy(p).add(_.multiplyScalar(-p.dot(u.up))),d=-(this._zoom-f-this._zoom)/this._zoom,M=this._getCameraDirection(fs),v=this._targetEnd.dot(M),g=Dt.copy(this._targetEnd).lerp(x,d),y=g.dot(M),A=M.multiplyScalar(y-v);g.sub(A),this._boundary.clampPoint(g,g);const T=Yt.subVectors(g,this._targetEnd);this._targetEnd.copy(g),this._target.add(T),this._changedZoom-=f,ne(this._changedZoom)&&(this._changedZoom=0)}}this._camera.zoom!==this._zoom&&(this._camera.zoom=this._zoom,this._camera.updateProjectionMatrix(),this._updateNearPlaneCorners(),this._needsUpdate=!0),this._dragNeedsUpdate=!0;const c=this._collisionTest();this._spherical.radius=Math.min(this._spherical.radius,c),this._spherical.makeSafe(),this._camera.position.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse).add(this._target),this._camera.lookAt(this._target),(!ne(this._focalOffset.x)||!ne(this._focalOffset.y)||!ne(this._focalOffset.z))&&(this._camera.updateMatrixWorld(),fn.setFromMatrixColumn(this._camera.matrix,0),dn.setFromMatrixColumn(this._camera.matrix,1),Qn.setFromMatrixColumn(this._camera.matrix,2),fn.multiplyScalar(this._focalOffset.x),dn.multiplyScalar(-this._focalOffset.y),Qn.multiplyScalar(this._focalOffset.z),Dt.copy(fn).add(dn).add(Qn),this._camera.position.add(Dt)),this._boundaryEnclosesCamera&&this._encloseToBoundary(this._camera.position.copy(this._target),Dt.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse),1);const h=this._needsUpdate;return h&&!this._updatedLastTime?(this._hasRested=!1,this.dispatchEvent({type:"wake"}),this.dispatchEvent({type:"update"})):h?(this.dispatchEvent({type:"update"}),ne(e,this.restThreshold)&&ne(n,this.restThreshold)&&ne(s,this.restThreshold)&&ne(r.x,this.restThreshold)&&ne(r.y,this.restThreshold)&&ne(r.z,this.restThreshold)&&ne(a.x,this.restThreshold)&&ne(a.y,this.restThreshold)&&ne(a.z,this.restThreshold)&&ne(o,this.restThreshold)&&!this._hasRested&&(this._hasRested=!0,this.dispatchEvent({type:"rest"}))):!h&&this._updatedLastTime&&this.dispatchEvent({type:"sleep"}),this._lastDistance=this._spherical.radius,this._lastZoom=this._zoom,this._updatedLastTime=h,this._needsUpdate=!1,h}toJSON(){return JSON.stringify({enabled:this._enabled,minDistance:this.minDistance,maxDistance:hs(this.maxDistance),minZoom:this.minZoom,maxZoom:hs(this.maxZoom),minPolarAngle:this.minPolarAngle,maxPolarAngle:hs(this.maxPolarAngle),minAzimuthAngle:hs(this.minAzimuthAngle),maxAzimuthAngle:hs(this.maxAzimuthAngle),smoothTime:this.smoothTime,draggingSmoothTime:this.draggingSmoothTime,dollySpeed:this.dollySpeed,truckSpeed:this.truckSpeed,dollyToCursor:this.dollyToCursor,verticalDragToForward:this.verticalDragToForward,target:this._targetEnd.toArray(),position:Dt.setFromSpherical(this._sphericalEnd).add(this._targetEnd).toArray(),zoom:this._zoomEnd,focalOffset:this._focalOffsetEnd.toArray(),target0:this._target0.toArray(),position0:this._position0.toArray(),zoom0:this._zoom0,focalOffset0:this._focalOffset0.toArray()})}fromJSON(t,e=!1){const n=JSON.parse(t);this.enabled=n.enabled,this.minDistance=n.minDistance,this.maxDistance=us(n.maxDistance),this.minZoom=n.minZoom,this.maxZoom=us(n.maxZoom),this.minPolarAngle=n.minPolarAngle,this.maxPolarAngle=us(n.maxPolarAngle),this.minAzimuthAngle=us(n.minAzimuthAngle),this.maxAzimuthAngle=us(n.maxAzimuthAngle),this.smoothTime=n.smoothTime,this.draggingSmoothTime=n.draggingSmoothTime,this.dollySpeed=n.dollySpeed,this.truckSpeed=n.truckSpeed,this.dollyToCursor=n.dollyToCursor,this.verticalDragToForward=n.verticalDragToForward,this._target0.fromArray(n.target0),this._position0.fromArray(n.position0),this._zoom0=n.zoom0,this._focalOffset0.fromArray(n.focalOffset0),this.moveTo(n.target[0],n.target[1],n.target[2],e),Ye.setFromVector3(Dt.fromArray(n.position).sub(this._targetEnd).applyQuaternion(this._yAxisUpSpace)),this.rotateTo(Ye.theta,Ye.phi,e),this.dollyTo(Ye.radius,e),this.zoomTo(n.zoom,e),this.setFocalOffset(n.focalOffset[0],n.focalOffset[1],n.focalOffset[2],e),this._needsUpdate=!0}connect(t){if(this._domElement){console.warn("camera-controls is already connected.");return}t.setAttribute("data-camera-controls-version",J_),this._addAllEventListeners(t),this._getClientRect(this._elementRect)}disconnect(){this.cancel(),this._removeAllEventListeners(),this._domElement&&(this._domElement.removeAttribute("data-camera-controls-version"),this._domElement=void 0)}dispose(){this.removeAllEventListeners(),this.disconnect()}_getTargetDirection(t){return t.setFromSpherical(this._spherical).divideScalar(this._spherical.radius).applyQuaternion(this._yAxisUpSpaceInverse)}_getCameraDirection(t){return this._getTargetDirection(t).negate()}_findPointerById(t){return this._activePointers.find(e=>e.pointerId===t)}_findPointerByMouseButton(t){return this._activePointers.find(e=>e.mouseButton===t)}_disposePointer(t){this._activePointers.splice(this._activePointers.indexOf(t),1)}_encloseToBoundary(t,e,n){const s=e.lengthSq();if(s===0)return t;const r=Yt.copy(e).add(t),o=this._boundary.clampPoint(r,Ci).sub(r),c=o.lengthSq();if(c===0)return t.add(e);if(c===s)return t;if(n===0)return t.add(e).add(o);{const l=1+n*c/e.dot(o);return t.add(Yt.copy(e).multiplyScalar(l)).add(o.multiplyScalar(1-n))}}_updateNearPlaneCorners(){if(Jn(this._camera)){const t=this._camera,e=t.near,n=t.getEffectiveFOV()*ls,s=Math.tan(n*.5)*e,r=s*t.aspect;this._nearPlaneCorners[0].set(-r,-s,0),this._nearPlaneCorners[1].set(r,-s,0),this._nearPlaneCorners[2].set(r,s,0),this._nearPlaneCorners[3].set(-r,s,0)}else if(Fn(this._camera)){const t=this._camera,e=1/t.zoom,n=t.left*e,s=t.right*e,r=t.top*e,a=t.bottom*e;this._nearPlaneCorners[0].set(n,r,0),this._nearPlaneCorners[1].set(s,r,0),this._nearPlaneCorners[2].set(s,a,0),this._nearPlaneCorners[3].set(n,a,0)}}_collisionTest(){let t=1/0;if(!(this.colliderMeshes.length>=1)||To(this._camera,"_collisionTest"))return t;const n=this._getTargetDirection(fs);Co.lookAt(el,n,this._camera.up);for(let s=0;s<4;s++){const r=Yt.copy(this._nearPlaneCorners[s]);r.applyMatrix4(Co);const a=Ci.addVectors(this._target,r);rr.set(a,n),rr.far=this._spherical.radius+1;const o=rr.intersectObjects(this.colliderMeshes);o.length!==0&&o[0].distance<t&&(t=o[0].distance)}return t}_getClientRect(t){if(!this._domElement)return;const e=this._domElement.getBoundingClientRect();return t.x=e.left,t.y=e.top,this._viewport?(t.x+=this._viewport.x,t.y+=e.height-this._viewport.w-this._viewport.y,t.width=this._viewport.z,t.height=this._viewport.w):(t.width=e.width,t.height=e.height),t}_createOnRestPromise(t){return t?Promise.resolve():(this._hasRested=!1,this.dispatchEvent({type:"transitionstart"}),new Promise(e=>{const n=()=>{this.removeEventListener("rest",n),e()};this.addEventListener("rest",n)}))}_addAllEventListeners(t){}_removeAllEventListeners(){}get dampingFactor(){return console.warn(".dampingFactor has been deprecated. use smoothTime (in seconds) instead."),0}set dampingFactor(t){console.warn(".dampingFactor has been deprecated. use smoothTime (in seconds) instead.")}get draggingDampingFactor(){return console.warn(".draggingDampingFactor has been deprecated. use draggingSmoothTime (in seconds) instead."),0}set draggingDampingFactor(t){console.warn(".draggingDampingFactor has been deprecated. use draggingSmoothTime (in seconds) instead.")}static createBoundingSphere(t,e=new Mt.Sphere){const n=e,s=n.center;Ri.makeEmpty(),t.traverseVisible(a=>{a.isMesh&&Ri.expandByObject(a)}),Ri.getCenter(s);let r=0;return t.traverseVisible(a=>{if(!a.isMesh)return;const o=a,c=o.geometry.clone();c.applyMatrix4(o.matrixWorld);const h=c.attributes.position;for(let f=0,u=h.count;f<u;f++)Dt.fromBufferAttribute(h,f),r=Math.max(r,s.distanceToSquared(Dt))}),n.radius=Math.sqrt(r),n}}class Ee{constructor(){ht(this,"trigger",t=>{const e=this.handlers.slice(0);for(const n of e)n(t)});ht(this,"handlers",[])}add(t){this.handlers.push(t)}remove(t){this.handlers=this.handlers.filter(e=>e!==t)}reset(){this.handlers.length=0}}class ma{constructor(t){ht(this,"isDisposeable",()=>"dispose"in this&&"onDisposed"in this);ht(this,"isResizeable",()=>"resize"in this&&"getSize"in this);ht(this,"isUpdateable",()=>"onAfterUpdate"in this&&"onBeforeUpdate"in this&&"update"in this);ht(this,"isHideable",()=>"visible"in this);ht(this,"isConfigurable",()=>"setup"in this&&"config"in this&&"onSetup"in this);this.components=t}}class lh extends ma{}class _a extends ma{constructor(){super(...arguments);ht(this,"_world",null);ht(this,"onWorldChanged",new Ee)}get world(){if(!this._world)throw new Error("World not initialized!");return this._world}set world(e){this._world=e,this.onWorldChanged.trigger(e)}}class eg extends _a{}class ng extends _a{constructor(){super(...arguments);ht(this,"onAfterUpdate",new Ee);ht(this,"onBeforeUpdate",new Ee);ht(this,"onDisposed",new Ee);ht(this,"onResize",new Ee)}}const Ts=class Ts extends lh{constructor(e){super(e);ht(this,"_disposedComponents",new Set);ht(this,"enabled",!0);e.add(Ts.uuid,this)}get(){return this._disposedComponents}destroy(e,n=!0,s=!0){e.removeFromParent();const r=e;r.dispose&&r.dispose(),this.disposeGeometryAndMaterials(e,n),s&&r.children&&r.children.length&&this.disposeChildren(r),e.children.length=0}disposeGeometry(e){const n=e;n.boundsTree&&n.disposeBoundsTree(),e.dispose()}disposeGeometryAndMaterials(e,n){const s=e;s.geometry&&this.disposeGeometry(s.geometry),n&&s.material&&Ts.disposeMaterial(s),s.material=[],s.geometry=null}disposeChildren(e){for(const n of e.children)this.destroy(n)}static disposeMaterial(e){if(e.material)if(Array.isArray(e.material))for(const n of e.material)n.dispose();else e.material.dispose()}};ht(Ts,"uuid","76e9cd8e-ad8f-4753-9ef6-cbc60f7247fe");let Pr=Ts;class ig extends _a{constructor(e){super(e);ht(this,"onDisposed",new Ee)}dispose(){const e=this.components.get(Pr);for(const n of this.three.children){const s=n;s.geometry&&e.destroy(s)}this.three.children=[],this.onDisposed.trigger(),this.onDisposed.reset()}}class ga extends eg{constructor(e){super(e);ht(this,"onBeforeUpdate",new Ee);ht(this,"onAfterUpdate",new Ee);ht(this,"onAspectUpdated",new Ee);ht(this,"onDisposed",new Ee);ht(this,"three");ht(this,"_controls");ht(this,"updateAspect",()=>{var e;if(!(!this.world||!this.world.renderer)&&(e=this.world.renderer)!=null&&e.isResizeable()){const n=this.world.renderer.getSize();this.three.aspect=n.width/n.height,this.three.updateProjectionMatrix(),this.onAspectUpdated.trigger()}});this.three=this.setupCamera(),this.setupEvents(!0),this.onWorldChanged.add(()=>{this._controls&&this._controls.dispose(),this._controls=this.newCameraControls()})}get controls(){if(!this._controls)throw new Error("Camera not initialized!");return this._controls}get enabled(){return this.controls.enabled}set enabled(e){this.controls.enabled=e}dispose(){this.setupEvents(!1),this.enabled=!1,this.onAspectUpdated.reset(),this.onBeforeUpdate.reset(),this.onAfterUpdate.reset(),this.three.removeFromParent(),this.controls.dispose(),this.onDisposed.trigger(),this.onDisposed.reset()}async update(e){this.enabled&&(await this.onBeforeUpdate.trigger(this),this.controls.update(e),await this.onAfterUpdate.trigger(this))}setupCamera(){const e=window.innerWidth/window.innerHeight,n=new Ze(60,e,1,1e3);return n.position.set(50,50,50),n.lookAt(new L(0,0,0)),n}newCameraControls(){if(!this.world)throw new Error("This camera needs a world to work!");if(!this.world.renderer)throw new Error("This camera needs a renderer to work!");Cs.install({THREE:ga.getSubsetOfThree()});const{domElement:e}=this.world.renderer.three,n=new Cs(this.three,e);return n.smoothTime=.2,n.dollyToCursor=!0,n.infinityDolly=!0,n}setupEvents(e){e?window.addEventListener("resize",this.updateAspect):window.removeEventListener("resize",this.updateAspect)}static getSubsetOfThree(){return{MOUSE:Mh,Vector2:kt,Vector3:L,Vector4:pe,Quaternion:Qi,Matrix4:Kt,Spherical:$_,Box3:ye,Sphere:Rs,Raycaster:K_,MathUtils:Nu}}}const hh=0,sg=1,rg=2,ol=2,Ro=1.25,al=1,Sr=6*4+4+4,Hr=65535,og=Math.pow(2,-24),Po=Symbol("SKIP_GENERATION");function ag(i){return i.index?i.index.count:i.attributes.position.count}function ns(i){return ag(i)/3}function cg(i,t=ArrayBuffer){return i>65535?new Uint32Array(new t(4*i)):new Uint16Array(new t(2*i))}function lg(i,t){if(!i.index){const e=i.attributes.position.count,n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,s=cg(e,n);i.setIndex(new tn(s,1));for(let r=0;r<e;r++)s[r]=r}}function uh(i){const t=ns(i),e=i.drawRange,n=e.start/3,s=(e.start+e.count)/3,r=Math.max(0,n),a=Math.min(t,s)-r;return[{offset:Math.floor(r),count:Math.floor(a)}]}function fh(i){if(!i.groups||!i.groups.length)return uh(i);const t=[],e=new Set,n=i.drawRange,s=n.start/3,r=(n.start+n.count)/3;for(const o of i.groups){const c=o.start/3,l=(o.start+o.count)/3;e.add(Math.max(s,c)),e.add(Math.min(r,l))}const a=Array.from(e.values()).sort((o,c)=>o-c);for(let o=0;o<a.length-1;o++){const c=a[o],l=a[o+1];t.push({offset:Math.floor(c),count:Math.floor(l-c)})}return t}function hg(i){if(i.groups.length===0)return!1;const t=ns(i),e=fh(i).sort((r,a)=>r.offset-a.offset),n=e[e.length-1];n.count=Math.min(t-n.offset,n.count);let s=0;return e.forEach(({count:r})=>s+=r),t!==s}function ae(i,t,e){return e.min.x=t[i],e.min.y=t[i+1],e.min.z=t[i+2],e.max.x=t[i+3],e.max.y=t[i+4],e.max.z=t[i+5],e}function ug(i){i[0]=i[1]=i[2]=1/0,i[3]=i[4]=i[5]=-1/0}function cl(i){let t=-1,e=-1/0;for(let n=0;n<3;n++){const s=i[n+3]-i[n];s>e&&(e=s,t=n)}return t}function ll(i,t){t.set(i)}function hl(i,t,e){let n,s;for(let r=0;r<3;r++){const a=r+3;n=i[r],s=t[r],e[r]=n<s?n:s,n=i[a],s=t[a],e[a]=n>s?n:s}}function or(i,t,e){for(let n=0;n<3;n++){const s=t[i+2*n],r=t[i+2*n+1],a=s-r,o=s+r;a<e[n]&&(e[n]=a),o>e[n+3]&&(e[n+3]=o)}}function ps(i){const t=i[3]-i[0],e=i[4]-i[1],n=i[5]-i[2];return 2*(t*e+e*n+n*t)}function Lo(i,t,e,n,s=null){let r=1/0,a=1/0,o=1/0,c=-1/0,l=-1/0,h=-1/0,f=1/0,u=1/0,p=1/0,_=-1/0,x=-1/0,m=-1/0;const d=s!==null;for(let M=t*6,v=(t+e)*6;M<v;M+=6){const g=i[M+0],y=i[M+1],A=g-y,T=g+y;A<r&&(r=A),T>c&&(c=T),d&&g<f&&(f=g),d&&g>_&&(_=g);const P=i[M+2],E=i[M+3],S=P-E,D=P+E;S<a&&(a=S),D>l&&(l=D),d&&P<u&&(u=P),d&&P>x&&(x=P);const I=i[M+4],B=i[M+5],R=I-B,O=I+B;R<o&&(o=R),O>h&&(h=O),d&&I<p&&(p=I),d&&I>m&&(m=I)}n[0]=r,n[1]=a,n[2]=o,n[3]=c,n[4]=l,n[5]=h,d&&(s[0]=f,s[1]=u,s[2]=p,s[3]=_,s[4]=x,s[5]=m)}function fg(i,t,e,n){let s=1/0,r=1/0,a=1/0,o=-1/0,c=-1/0,l=-1/0;for(let h=t*6,f=(t+e)*6;h<f;h+=6){const u=i[h+0];u<s&&(s=u),u>o&&(o=u);const p=i[h+2];p<r&&(r=p),p>c&&(c=p);const _=i[h+4];_<a&&(a=_),_>l&&(l=_)}n[0]=s,n[1]=r,n[2]=a,n[3]=o,n[4]=c,n[5]=l}function dg(i,t){ug(t);const e=i.attributes.position,n=i.index?i.index.array:null,s=ns(i),r=new Float32Array(s*6),a=e.normalized,o=e.array,c=e.offset||0;let l=3;e.isInterleavedBufferAttribute&&(l=e.data.stride);const h=["getX","getY","getZ"];for(let f=0;f<s;f++){const u=f*3,p=f*6;let _=u+0,x=u+1,m=u+2;n&&(_=n[_],x=n[x],m=n[m]),a||(_=_*l+c,x=x*l+c,m=m*l+c);for(let d=0;d<3;d++){let M,v,g;a?(M=e[h[d]](_),v=e[h[d]](x),g=e[h[d]](m)):(M=o[_+d],v=o[x+d],g=o[m+d]);let y=M;v<y&&(y=v),g<y&&(y=g);let A=M;v>A&&(A=v),g>A&&(A=g);const T=(A-y)/2,P=d*2;r[p+P+0]=y+T,r[p+P+1]=T+(Math.abs(y)+T)*og,y<t[d]&&(t[d]=y),A>t[d+3]&&(t[d+3]=A)}}return r}const Tn=32,pg=(i,t)=>i.candidate-t.candidate,Nn=new Array(Tn).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),ar=new Float32Array(6);function mg(i,t,e,n,s,r){let a=-1,o=0;if(r===hh)a=cl(t),a!==-1&&(o=(t[a]+t[a+3])/2);else if(r===sg)a=cl(i),a!==-1&&(o=_g(e,n,s,a));else if(r===rg){const c=ps(i);let l=Ro*s;const h=n*6,f=(n+s)*6;for(let u=0;u<3;u++){const p=t[u],m=(t[u+3]-p)/Tn;if(s<Tn/4){const d=[...Nn];d.length=s;let M=0;for(let g=h;g<f;g+=6,M++){const y=d[M];y.candidate=e[g+2*u],y.count=0;const{bounds:A,leftCacheBounds:T,rightCacheBounds:P}=y;for(let E=0;E<3;E++)P[E]=1/0,P[E+3]=-1/0,T[E]=1/0,T[E+3]=-1/0,A[E]=1/0,A[E+3]=-1/0;or(g,e,A)}d.sort(pg);let v=s;for(let g=0;g<v;g++){const y=d[g];for(;g+1<v&&d[g+1].candidate===y.candidate;)d.splice(g+1,1),v--}for(let g=h;g<f;g+=6){const y=e[g+2*u];for(let A=0;A<v;A++){const T=d[A];y>=T.candidate?or(g,e,T.rightCacheBounds):(or(g,e,T.leftCacheBounds),T.count++)}}for(let g=0;g<v;g++){const y=d[g],A=y.count,T=s-y.count,P=y.leftCacheBounds,E=y.rightCacheBounds;let S=0;A!==0&&(S=ps(P)/c);let D=0;T!==0&&(D=ps(E)/c);const I=al+Ro*(S*A+D*T);I<l&&(a=u,l=I,o=y.candidate)}}else{for(let v=0;v<Tn;v++){const g=Nn[v];g.count=0,g.candidate=p+m+v*m;const y=g.bounds;for(let A=0;A<3;A++)y[A]=1/0,y[A+3]=-1/0}for(let v=h;v<f;v+=6){let A=~~((e[v+2*u]-p)/m);A>=Tn&&(A=Tn-1);const T=Nn[A];T.count++,or(v,e,T.bounds)}const d=Nn[Tn-1];ll(d.bounds,d.rightCacheBounds);for(let v=Tn-2;v>=0;v--){const g=Nn[v],y=Nn[v+1];hl(g.bounds,y.rightCacheBounds,g.rightCacheBounds)}let M=0;for(let v=0;v<Tn-1;v++){const g=Nn[v],y=g.count,A=g.bounds,P=Nn[v+1].rightCacheBounds;y!==0&&(M===0?ll(A,ar):hl(A,ar,ar)),M+=y;let E=0,S=0;M!==0&&(E=ps(ar)/c);const D=s-M;D!==0&&(S=ps(P)/c);const I=al+Ro*(E*M+S*D);I<l&&(a=u,l=I,o=g.candidate)}}}}else console.warn(`MeshBVH: Invalid build strategy value ${r} used.`);return{axis:a,pos:o}}function _g(i,t,e,n){let s=0;for(let r=t,a=t+e;r<a;r++)s+=i[r*6+n*2];return s/e}class cr{constructor(){}}function gg(i,t,e,n,s,r){let a=n,o=n+s-1;const c=r.pos,l=r.axis*2;for(;;){for(;a<=o&&e[a*6+l]<c;)a++;for(;a<=o&&e[o*6+l]>=c;)o--;if(a<o){for(let h=0;h<3;h++){let f=t[a*3+h];t[a*3+h]=t[o*3+h],t[o*3+h]=f}for(let h=0;h<6;h++){let f=e[a*6+h];e[a*6+h]=e[o*6+h],e[o*6+h]=f}a++,o--}else return a}}function xg(i,t,e,n,s,r){let a=n,o=n+s-1;const c=r.pos,l=r.axis*2;for(;;){for(;a<=o&&e[a*6+l]<c;)a++;for(;a<=o&&e[o*6+l]>=c;)o--;if(a<o){let h=i[a];i[a]=i[o],i[o]=h;for(let f=0;f<6;f++){let u=e[a*6+f];e[a*6+f]=e[o*6+f],e[o*6+f]=u}a++,o--}else return a}}function vg(i,t){const e=(i.index?i.index.count:i.attributes.position.count)/3,n=e>2**16,s=n?4:2,r=t?new SharedArrayBuffer(e*s):new ArrayBuffer(e*s),a=n?new Uint32Array(r):new Uint16Array(r);for(let o=0,c=a.length;o<c;o++)a[o]=o;return a}function Eg(i,t){const e=i.geometry,n=e.index?e.index.array:null,s=t.maxDepth,r=t.verbose,a=t.maxLeafTris,o=t.strategy,c=t.onProgress,l=ns(e),h=i._indirectBuffer;let f=!1;const u=new Float32Array(6),p=new Float32Array(6),_=dg(e,u),x=t.indirect?xg:gg,m=[],d=t.indirect?uh(e):fh(e);if(d.length===1){const g=d[0],y=new cr;y.boundingData=u,fg(_,g.offset,g.count,p),v(y,g.offset,g.count,p),m.push(y)}else for(let g of d){const y=new cr;y.boundingData=new Float32Array(6),Lo(_,g.offset,g.count,y.boundingData,p),v(y,g.offset,g.count,p),m.push(y)}return m;function M(g){c&&c(g/l)}function v(g,y,A,T=null,P=0){if(!f&&P>=s&&(f=!0,r&&(console.warn(`MeshBVH: Max depth of ${s} reached when generating BVH. Consider increasing maxDepth.`),console.warn(e))),A<=a||P>=s)return M(y+A),g.offset=y,g.count=A,g;const E=mg(g.boundingData,T,_,y,A,o);if(E.axis===-1)return M(y+A),g.offset=y,g.count=A,g;const S=x(h,n,_,y,A,E);if(S===y||S===y+A)M(y+A),g.offset=y,g.count=A;else{g.splitAxis=E.axis;const D=new cr,I=y,B=S-y;g.left=D,D.boundingData=new Float32Array(6),Lo(_,I,B,D.boundingData,p),v(D,I,B,p,P+1);const R=new cr,O=S,F=A-B;g.right=R,R.boundingData=new Float32Array(6),Lo(_,O,F,R.boundingData,p),v(R,O,F,p,P+1)}return g}}function Mg(i,t){const e=i.geometry;t.indirect&&(i._indirectBuffer=vg(e,t.useSharedArrayBuffer),hg(e)&&!t.verbose&&console.warn('MeshBVH: Provided geometry contains groups that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.')),i._indirectBuffer||lg(e,t);const n=Eg(i,t);let s,r,a;const o=[],c=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer;for(let f=0;f<n.length;f++){const u=n[f];let p=l(u);const _=new c(Sr*p);s=new Float32Array(_),r=new Uint32Array(_),a=new Uint16Array(_),h(0,u),o.push(_)}i._roots=o;return;function l(f){return f.count?1:1+l(f.left)+l(f.right)}function h(f,u){const p=f/4,_=f/2,x=!!u.count,m=u.boundingData;for(let d=0;d<6;d++)s[p+d]=m[d];if(x){const d=u.offset,M=u.count;return r[p+6]=d,a[_+14]=M,a[_+15]=Hr,f+Sr}else{const d=u.left,M=u.right,v=u.splitAxis;let g;if(g=h(f+Sr,d),g/4>Math.pow(2,32))throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");return r[p+6]=g/4,g=h(g,M),r[p+7]=v,g}}}class Pn{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(t,e){let n=1/0,s=-1/0;for(let r=0,a=t.length;r<a;r++){const c=t[r][e];n=c<n?c:n,s=c>s?c:s}this.min=n,this.max=s}setFromPoints(t,e){let n=1/0,s=-1/0;for(let r=0,a=e.length;r<a;r++){const o=e[r],c=t.dot(o);n=c<n?c:n,s=c>s?c:s}this.min=n,this.max=s}isSeparated(t){return this.min>t.max||t.min>this.max}}Pn.prototype.setFromBox=function(){const i=new L;return function(e,n){const s=n.min,r=n.max;let a=1/0,o=-1/0;for(let c=0;c<=1;c++)for(let l=0;l<=1;l++)for(let h=0;h<=1;h++){i.x=s.x*c+r.x*(1-c),i.y=s.y*l+r.y*(1-l),i.z=s.z*h+r.z*(1-h);const f=e.dot(i);a=Math.min(f,a),o=Math.max(f,o)}this.min=a,this.max=o}}();const Sg=function(){const i=new L,t=new L,e=new L;return function(s,r,a){const o=s.start,c=i,l=r.start,h=t;e.subVectors(o,l),i.subVectors(s.end,s.start),t.subVectors(r.end,r.start);const f=e.dot(h),u=h.dot(c),p=h.dot(h),_=e.dot(c),m=c.dot(c)*p-u*u;let d,M;m!==0?d=(f*u-_*p)/m:d=0,M=(f+d*u)/p,a.x=d,a.y=M}}(),xa=function(){const i=new kt,t=new L,e=new L;return function(s,r,a,o){Sg(s,r,i);let c=i.x,l=i.y;if(c>=0&&c<=1&&l>=0&&l<=1){s.at(c,a),r.at(l,o);return}else if(c>=0&&c<=1){l<0?r.at(0,o):r.at(1,o),s.closestPointToPoint(o,!0,a);return}else if(l>=0&&l<=1){c<0?s.at(0,a):s.at(1,a),r.closestPointToPoint(a,!0,o);return}else{let h;c<0?h=s.start:h=s.end;let f;l<0?f=r.start:f=r.end;const u=t,p=e;if(s.closestPointToPoint(f,!0,t),r.closestPointToPoint(h,!0,e),u.distanceToSquared(f)<=p.distanceToSquared(h)){a.copy(u),o.copy(f);return}else{a.copy(h),o.copy(p);return}}}}(),yg=function(){const i=new L,t=new L,e=new An,n=new wn;return function(r,a){const{radius:o,center:c}=r,{a:l,b:h,c:f}=a;if(n.start=l,n.end=h,n.closestPointToPoint(c,!0,i).distanceTo(c)<=o||(n.start=l,n.end=f,n.closestPointToPoint(c,!0,i).distanceTo(c)<=o)||(n.start=h,n.end=f,n.closestPointToPoint(c,!0,i).distanceTo(c)<=o))return!0;const x=a.getPlane(e);if(Math.abs(x.distanceToPoint(c))<=o){const d=x.projectPoint(c,t);if(a.containsPoint(d))return!0}return!1}}(),Tg=1e-15;function Uo(i){return Math.abs(i)<Tg}class hn extends we{constructor(...t){super(...t),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new L),this.satBounds=new Array(4).fill().map(()=>new Pn),this.points=[this.a,this.b,this.c],this.sphere=new Rs,this.plane=new An,this.needsUpdate=!0}intersectsSphere(t){return yg(t,this)}update(){const t=this.a,e=this.b,n=this.c,s=this.points,r=this.satAxes,a=this.satBounds,o=r[0],c=a[0];this.getNormal(o),c.setFromPoints(o,s);const l=r[1],h=a[1];l.subVectors(t,e),h.setFromPoints(l,s);const f=r[2],u=a[2];f.subVectors(e,n),u.setFromPoints(f,s);const p=r[3],_=a[3];p.subVectors(n,t),_.setFromPoints(p,s),this.sphere.setFromPoints(this.points),this.plane.setFromNormalAndCoplanarPoint(o,t),this.needsUpdate=!1}}hn.prototype.closestPointToSegment=function(){const i=new L,t=new L,e=new wn;return function(s,r=null,a=null){const{start:o,end:c}=s,l=this.points;let h,f=1/0;for(let u=0;u<3;u++){const p=(u+1)%3;e.start.copy(l[u]),e.end.copy(l[p]),xa(e,s,i,t),h=i.distanceToSquared(t),h<f&&(f=h,r&&r.copy(i),a&&a.copy(t))}return this.closestPointToPoint(o,i),h=o.distanceToSquared(i),h<f&&(f=h,r&&r.copy(i),a&&a.copy(o)),this.closestPointToPoint(c,i),h=c.distanceToSquared(i),h<f&&(f=h,r&&r.copy(i),a&&a.copy(c)),Math.sqrt(f)}}();hn.prototype.intersectsTriangle=function(){const i=new hn,t=new Array(3),e=new Array(3),n=new Pn,s=new Pn,r=new L,a=new L,o=new L,c=new L,l=new L,h=new wn,f=new wn,u=new wn,p=new L;function _(x,m,d){const M=x.points;let v=0,g=-1;for(let y=0;y<3;y++){const{start:A,end:T}=h;A.copy(M[y]),T.copy(M[(y+1)%3]),h.delta(a);const P=Uo(m.distanceToPoint(A));if(Uo(m.normal.dot(a))&&P){d.copy(h),v=2;break}const E=m.intersectLine(h,p);if(!E&&P&&p.copy(A),(E||P)&&!Uo(p.distanceTo(T))){if(v<=1)(v===1?d.start:d.end).copy(p),P&&(g=v);else if(v>=2){(g===1?d.start:d.end).copy(p),v=2;break}if(v++,v===2&&g===-1)break}}return v}return function(m,d=null,M=!1){this.needsUpdate&&this.update(),m.isExtendedTriangle?m.needsUpdate&&m.update():(i.copy(m),i.update(),m=i);const v=this.plane,g=m.plane;if(Math.abs(v.normal.dot(g.normal))>1-1e-10){const y=this.satBounds,A=this.satAxes;e[0]=m.a,e[1]=m.b,e[2]=m.c;for(let E=0;E<4;E++){const S=y[E],D=A[E];if(n.setFromPoints(D,e),S.isSeparated(n))return!1}const T=m.satBounds,P=m.satAxes;t[0]=this.a,t[1]=this.b,t[2]=this.c;for(let E=0;E<4;E++){const S=T[E],D=P[E];if(n.setFromPoints(D,t),S.isSeparated(n))return!1}for(let E=0;E<4;E++){const S=A[E];for(let D=0;D<4;D++){const I=P[D];if(r.crossVectors(S,I),n.setFromPoints(r,t),s.setFromPoints(r,e),n.isSeparated(s))return!1}}return d&&(M||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),d.start.set(0,0,0),d.end.set(0,0,0)),!0}else{const y=_(this,g,f);if(y===1&&m.containsPoint(f.end))return d&&(d.start.copy(f.end),d.end.copy(f.end)),!0;if(y!==2)return!1;const A=_(m,v,u);if(A===1&&this.containsPoint(u.end))return d&&(d.start.copy(u.end),d.end.copy(u.end)),!0;if(A!==2)return!1;if(f.delta(o),u.delta(c),o.dot(c)<0){let B=u.start;u.start=u.end,u.end=B}const T=f.start.dot(o),P=f.end.dot(o),E=u.start.dot(o),S=u.end.dot(o),D=P<E,I=T<S;return T!==S&&E!==P&&D===I?!1:(d&&(l.subVectors(f.start,u.start),l.dot(o)>0?d.start.copy(f.start):d.start.copy(u.start),l.subVectors(f.end,u.end),l.dot(o)<0?d.end.copy(f.end):d.end.copy(u.end)),!0)}}}();hn.prototype.distanceToPoint=function(){const i=new L;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}}();hn.prototype.distanceToTriangle=function(){const i=new L,t=new L,e=["a","b","c"],n=new wn,s=new wn;return function(a,o=null,c=null){const l=o||c?n:null;if(this.intersectsTriangle(a,l))return(o||c)&&(o&&l.getCenter(o),c&&l.getCenter(c)),0;let h=1/0;for(let f=0;f<3;f++){let u;const p=e[f],_=a[p];this.closestPointToPoint(_,i),u=_.distanceToSquared(i),u<h&&(h=u,o&&o.copy(i),c&&c.copy(_));const x=this[p];a.closestPointToPoint(x,i),u=x.distanceToSquared(i),u<h&&(h=u,o&&o.copy(x),c&&c.copy(i))}for(let f=0;f<3;f++){const u=e[f],p=e[(f+1)%3];n.set(this[u],this[p]);for(let _=0;_<3;_++){const x=e[_],m=e[(_+1)%3];s.set(a[x],a[m]),xa(n,s,i,t);const d=i.distanceToSquared(t);d<h&&(h=d,o&&o.copy(i),c&&c.copy(t))}}return Math.sqrt(h)}}();class Ne{constructor(t,e,n){this.isOrientedBox=!0,this.min=new L,this.max=new L,this.matrix=new Kt,this.invMatrix=new Kt,this.points=new Array(8).fill().map(()=>new L),this.satAxes=new Array(3).fill().map(()=>new L),this.satBounds=new Array(3).fill().map(()=>new Pn),this.alignedSatBounds=new Array(3).fill().map(()=>new Pn),this.needsUpdate=!1,t&&this.min.copy(t),e&&this.max.copy(e),n&&this.matrix.copy(n)}set(t,e,n){this.min.copy(t),this.max.copy(e),this.matrix.copy(n),this.needsUpdate=!0}copy(t){this.min.copy(t.min),this.max.copy(t.max),this.matrix.copy(t.matrix),this.needsUpdate=!0}}Ne.prototype.update=function(){return function(){const t=this.matrix,e=this.min,n=this.max,s=this.points;for(let l=0;l<=1;l++)for(let h=0;h<=1;h++)for(let f=0;f<=1;f++){const u=1*l|2*h|4*f,p=s[u];p.x=l?n.x:e.x,p.y=h?n.y:e.y,p.z=f?n.z:e.z,p.applyMatrix4(t)}const r=this.satBounds,a=this.satAxes,o=s[0];for(let l=0;l<3;l++){const h=a[l],f=r[l],u=1<<l,p=s[u];h.subVectors(o,p),f.setFromPoints(h,s)}const c=this.alignedSatBounds;c[0].setFromPointsField(s,"x"),c[1].setFromPointsField(s,"y"),c[2].setFromPointsField(s,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}}();Ne.prototype.intersectsBox=function(){const i=new Pn;return function(e){this.needsUpdate&&this.update();const n=e.min,s=e.max,r=this.satBounds,a=this.satAxes,o=this.alignedSatBounds;if(i.min=n.x,i.max=s.x,o[0].isSeparated(i)||(i.min=n.y,i.max=s.y,o[1].isSeparated(i))||(i.min=n.z,i.max=s.z,o[2].isSeparated(i)))return!1;for(let c=0;c<3;c++){const l=a[c],h=r[c];if(i.setFromBox(l,e),h.isSeparated(i))return!1}return!0}}();Ne.prototype.intersectsTriangle=function(){const i=new hn,t=new Array(3),e=new Pn,n=new Pn,s=new L;return function(a){this.needsUpdate&&this.update(),a.isExtendedTriangle?a.needsUpdate&&a.update():(i.copy(a),i.update(),a=i);const o=this.satBounds,c=this.satAxes;t[0]=a.a,t[1]=a.b,t[2]=a.c;for(let u=0;u<3;u++){const p=o[u],_=c[u];if(e.setFromPoints(_,t),p.isSeparated(e))return!1}const l=a.satBounds,h=a.satAxes,f=this.points;for(let u=0;u<3;u++){const p=l[u],_=h[u];if(e.setFromPoints(_,f),p.isSeparated(e))return!1}for(let u=0;u<3;u++){const p=c[u];for(let _=0;_<4;_++){const x=h[_];if(s.crossVectors(p,x),e.setFromPoints(s,t),n.setFromPoints(s,f),e.isSeparated(n))return!1}}return!0}}();Ne.prototype.closestPointToPoint=function(){return function(t,e){return this.needsUpdate&&this.update(),e.copy(t).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),e}}();Ne.prototype.distanceToPoint=function(){const i=new L;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}}();Ne.prototype.distanceToBox=function(){const i=["x","y","z"],t=new Array(12).fill().map(()=>new wn),e=new Array(12).fill().map(()=>new wn),n=new L,s=new L;return function(a,o=0,c=null,l=null){if(this.needsUpdate&&this.update(),this.intersectsBox(a))return(c||l)&&(a.getCenter(s),this.closestPointToPoint(s,n),a.closestPointToPoint(n,s),c&&c.copy(n),l&&l.copy(s)),0;const h=o*o,f=a.min,u=a.max,p=this.points;let _=1/0;for(let m=0;m<8;m++){const d=p[m];s.copy(d).clamp(f,u);const M=d.distanceToSquared(s);if(M<_&&(_=M,c&&c.copy(d),l&&l.copy(s),M<h))return Math.sqrt(M)}let x=0;for(let m=0;m<3;m++)for(let d=0;d<=1;d++)for(let M=0;M<=1;M++){const v=(m+1)%3,g=(m+2)%3,y=d<<v|M<<g,A=1<<m|d<<v|M<<g,T=p[y],P=p[A];t[x].set(T,P);const S=i[m],D=i[v],I=i[g],B=e[x],R=B.start,O=B.end;R[S]=f[S],R[D]=d?f[D]:u[D],R[I]=M?f[I]:u[D],O[S]=u[S],O[D]=d?f[D]:u[D],O[I]=M?f[I]:u[D],x++}for(let m=0;m<=1;m++)for(let d=0;d<=1;d++)for(let M=0;M<=1;M++){s.x=m?u.x:f.x,s.y=d?u.y:f.y,s.z=M?u.z:f.z,this.closestPointToPoint(s,n);const v=s.distanceToSquared(n);if(v<_&&(_=v,c&&c.copy(n),l&&l.copy(s),v<h))return Math.sqrt(v)}for(let m=0;m<12;m++){const d=t[m];for(let M=0;M<12;M++){const v=e[M];xa(d,v,n,s);const g=n.distanceToSquared(s);if(g<_&&(_=g,c&&c.copy(n),l&&l.copy(s),g<h))return Math.sqrt(g)}}return Math.sqrt(_)}}();class va{constructor(t){this._getNewPrimitive=t,this._primitives=[]}getPrimitive(){const t=this._primitives;return t.length===0?this._getNewPrimitive():t.pop()}releasePrimitive(t){this._primitives.push(t)}}class Ag extends va{constructor(){super(()=>new hn)}}const $e=new Ag;function Ve(i,t){return t[i+15]===65535}function Ge(i,t){return t[i+6]}function je(i,t){return t[i+14]}function Je(i){return i+8}function Qe(i,t){return t[i+6]}function dh(i,t){return t[i+7]}class bg{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const t=[];let e=null;this.setBuffer=n=>{e&&t.push(e),e=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{e=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,t.length!==0&&this.setBuffer(t.pop())}}}const se=new bg;let Vn,Wi;const Pi=[],lr=new va(()=>new ye);function wg(i,t,e,n,s,r){Vn=lr.getPrimitive(),Wi=lr.getPrimitive(),Pi.push(Vn,Wi),se.setBuffer(i._roots[t]);const a=jo(0,i.geometry,e,n,s,r);se.clearBuffer(),lr.releasePrimitive(Vn),lr.releasePrimitive(Wi),Pi.pop(),Pi.pop();const o=Pi.length;return o>0&&(Wi=Pi[o-1],Vn=Pi[o-2]),a}function jo(i,t,e,n,s=null,r=0,a=0){const{float32Array:o,uint16Array:c,uint32Array:l}=se;let h=i*2;if(Ve(h,c)){const _=Ge(i,l),x=je(h,c);return ae(i,o,Vn),n(_,x,!1,a,r+i,Vn)}else{let I=function(R){const{uint16Array:O,uint32Array:F}=se;let Y=R*2;for(;!Ve(Y,O);)R=Je(R),Y=R*2;return Ge(R,F)},B=function(R){const{uint16Array:O,uint32Array:F}=se;let Y=R*2;for(;!Ve(Y,O);)R=Qe(R,F),Y=R*2;return Ge(R,F)+je(Y,O)};var u=I,p=B;const _=Je(i),x=Qe(i,l);let m=_,d=x,M,v,g,y;if(s&&(g=Vn,y=Wi,ae(m,o,g),ae(d,o,y),M=s(g),v=s(y),v<M)){m=x,d=_;const R=M;M=v,v=R,g=y}g||(g=Vn,ae(m,o,g));const A=Ve(m*2,c),T=e(g,A,M,a+1,r+m);let P;if(T===ol){const R=I(m),F=B(m)-R;P=n(R,F,!0,a+1,r+m,g)}else P=T&&jo(m,t,e,n,s,r,a+1);if(P)return!0;y=Wi,ae(d,o,y);const E=Ve(d*2,c),S=e(y,E,v,a+1,r+d);let D;if(S===ol){const R=I(d),F=B(d)-R;D=n(R,F,!0,a+1,r+d,y)}else D=S&&jo(d,t,e,n,s,r,a+1);return!!D}}const ms=new L,Do=new L;function Cg(i,t,e={},n=0,s=1/0){const r=n*n,a=s*s;let o=1/0,c=null;if(i.shapecast({boundsTraverseOrder:h=>(ms.copy(t).clamp(h.min,h.max),ms.distanceToSquared(t)),intersectsBounds:(h,f,u)=>u<o&&u<a,intersectsTriangle:(h,f)=>{h.closestPointToPoint(t,ms);const u=t.distanceToSquared(ms);return u<o&&(Do.copy(ms),o=u,c=f),u<r}}),o===1/0)return null;const l=Math.sqrt(o);return e.point?e.point.copy(Do):e.point=Do.clone(),e.distance=l,e.faceIndex=c,e}const Li=new L,Ui=new L,Di=new L,hr=new kt,ur=new kt,fr=new kt,ul=new L,fl=new L,dl=new L,dr=new L;function Rg(i,t,e,n,s,r){let a;return r===Oe?a=i.intersectTriangle(n,e,t,!0,s):a=i.intersectTriangle(t,e,n,r!==mn,s),a===null?null:{distance:i.origin.distanceTo(s),point:s.clone()}}function Pg(i,t,e,n,s,r,a,o,c){Li.fromBufferAttribute(t,r),Ui.fromBufferAttribute(t,a),Di.fromBufferAttribute(t,o);const l=Rg(i,Li,Ui,Di,dr,c);if(l){n&&(hr.fromBufferAttribute(n,r),ur.fromBufferAttribute(n,a),fr.fromBufferAttribute(n,o),l.uv=we.getInterpolation(dr,Li,Ui,Di,hr,ur,fr,new kt)),s&&(hr.fromBufferAttribute(s,r),ur.fromBufferAttribute(s,a),fr.fromBufferAttribute(s,o),l.uv1=we.getInterpolation(dr,Li,Ui,Di,hr,ur,fr,new kt)),e&&(ul.fromBufferAttribute(e,r),fl.fromBufferAttribute(e,a),dl.fromBufferAttribute(e,o),l.normal=we.getInterpolation(dr,Li,Ui,Di,ul,fl,dl,new L),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));const h={a:r,b:a,c:o,normal:new L,materialIndex:0};we.getNormal(Li,Ui,Di,h.normal),l.face=h,l.faceIndex=r}return l}function Vr(i,t,e,n,s){const r=n*3;let a=r+0,o=r+1,c=r+2;const l=i.index;i.index&&(a=l.getX(a),o=l.getX(o),c=l.getX(c));const{position:h,normal:f,uv:u,uv1:p}=i.attributes,_=Pg(e,h,f,u,p,a,o,c,t);return _?(_.faceIndex=n,s&&s.push(_),_):null}function de(i,t,e,n){const s=i.a,r=i.b,a=i.c;let o=t,c=t+1,l=t+2;e&&(o=e.getX(o),c=e.getX(c),l=e.getX(l)),s.x=n.getX(o),s.y=n.getY(o),s.z=n.getZ(o),r.x=n.getX(c),r.y=n.getY(c),r.z=n.getZ(c),a.x=n.getX(l),a.y=n.getY(l),a.z=n.getZ(l)}function Lg(i,t,e,n,s,r){const{geometry:a,_indirectBuffer:o}=i;for(let c=n,l=n+s;c<l;c++)Vr(a,t,e,c,r)}function Ug(i,t,e,n,s){const{geometry:r,_indirectBuffer:a}=i;let o=1/0,c=null;for(let l=n,h=n+s;l<h;l++){let f;f=Vr(r,t,e,l),f&&f.distance<o&&(c=f,o=f.distance)}return c}function Dg(i,t,e,n,s,r,a){const{geometry:o}=e,{index:c}=o,l=o.attributes.position;for(let h=i,f=t+i;h<f;h++){let u;if(u=h,de(a,u*3,c,l),a.needsUpdate=!0,n(a,u,s,r))return!0}return!1}function Ig(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position;let r,a,o,c,l=0;const h=i._roots;for(let u=0,p=h.length;u<p;u++)r=h[u],a=new Uint32Array(r),o=new Uint16Array(r),c=new Float32Array(r),f(0,l),l+=r.byteLength;function f(u,p,_=!1){const x=u*2;if(o[x+15]===Hr){const d=a[u+6],M=o[x+14];let v=1/0,g=1/0,y=1/0,A=-1/0,T=-1/0,P=-1/0;for(let E=3*d,S=3*(d+M);E<S;E++){let D=n[E];const I=s.getX(D),B=s.getY(D),R=s.getZ(D);I<v&&(v=I),I>A&&(A=I),B<g&&(g=B),B>T&&(T=B),R<y&&(y=R),R>P&&(P=R)}return c[u+0]!==v||c[u+1]!==g||c[u+2]!==y||c[u+3]!==A||c[u+4]!==T||c[u+5]!==P?(c[u+0]=v,c[u+1]=g,c[u+2]=y,c[u+3]=A,c[u+4]=T,c[u+5]=P,!0):!1}else{const d=u+8,M=a[u+6],v=d+p,g=M+p;let y=_,A=!1,T=!1;t?y||(A=t.has(v),T=t.has(g),y=!A&&!T):(A=!0,T=!0);const P=y||A,E=y||T;let S=!1;P&&(S=f(d,p,y));let D=!1;E&&(D=f(M,p,y));const I=S||D;if(I)for(let B=0;B<3;B++){const R=d+B,O=M+B,F=c[R],Y=c[R+3],q=c[O],Z=c[O+3];c[u+B]=F<q?F:q,c[u+B+3]=Y>Z?Y:Z}return I}}}const pl=new ye;function Xn(i,t,e,n){return ae(i,t,pl),e.intersectBox(pl,n)}function Og(i,t,e,n,s,r){const{geometry:a,_indirectBuffer:o}=i;for(let c=n,l=n+s;c<l;c++){let h=o?o[c]:c;Vr(a,t,e,h,r)}}function Ng(i,t,e,n,s){const{geometry:r,_indirectBuffer:a}=i;let o=1/0,c=null;for(let l=n,h=n+s;l<h;l++){let f;f=Vr(r,t,e,a?a[l]:l),f&&f.distance<o&&(c=f,o=f.distance)}return c}function Fg(i,t,e,n,s,r,a){const{geometry:o}=e,{index:c}=o,l=o.attributes.position;for(let h=i,f=t+i;h<f;h++){let u;if(u=e.resolveTriangleIndex(h),de(a,u*3,c,l),a.needsUpdate=!0,n(a,u,s,r))return!0}return!1}const ml=new L;function Bg(i,t,e,n,s){se.setBuffer(i._roots[t]),Jo(0,i,e,n,s),se.clearBuffer()}function Jo(i,t,e,n,s){const{float32Array:r,uint16Array:a,uint32Array:o}=se,c=i*2;if(Ve(c,a)){const h=Ge(i,o),f=je(c,a);Lg(t,e,n,h,f,s)}else{const h=Je(i);Xn(h,r,n,ml)&&Jo(h,t,e,n,s);const f=Qe(i,o);Xn(f,r,n,ml)&&Jo(f,t,e,n,s)}}const _l=new L,zg=["x","y","z"];function Hg(i,t,e,n){se.setBuffer(i._roots[t]);const s=Qo(0,i,e,n);return se.clearBuffer(),s}function Qo(i,t,e,n){const{float32Array:s,uint16Array:r,uint32Array:a}=se;let o=i*2;if(Ve(o,r)){const l=Ge(i,a),h=je(o,r);return Ug(t,e,n,l,h)}else{const l=dh(i,a),h=zg[l],u=n.direction[h]>=0;let p,_;u?(p=Je(i),_=Qe(i,a)):(p=Qe(i,a),_=Je(i));const m=Xn(p,s,n,_l)?Qo(p,t,e,n):null;if(m){const v=m.point[h];if(u?v<=s[_+l]:v>=s[_+l+3])return m}const M=Xn(_,s,n,_l)?Qo(_,t,e,n):null;return m&&M?m.distance<=M.distance?m:M:m||M||null}}const pr=new ye,Ii=new hn,Oi=new hn,_s=new Kt,gl=new Ne,mr=new Ne;function Vg(i,t,e,n){se.setBuffer(i._roots[t]);const s=ta(0,i,e,n);return se.clearBuffer(),s}function ta(i,t,e,n,s=null){const{float32Array:r,uint16Array:a,uint32Array:o}=se;let c=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),gl.set(e.boundingBox.min,e.boundingBox.max,n),s=gl),Ve(c,a)){const h=t.geometry,f=h.index,u=h.attributes.position,p=e.index,_=e.attributes.position,x=Ge(i,o),m=je(c,a);if(_s.copy(n).invert(),e.boundsTree)return ae(i,r,mr),mr.matrix.copy(_s),mr.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:M=>mr.intersectsBox(M),intersectsTriangle:M=>{M.a.applyMatrix4(n),M.b.applyMatrix4(n),M.c.applyMatrix4(n),M.needsUpdate=!0;for(let v=x*3,g=(m+x)*3;v<g;v+=3)if(de(Oi,v,f,u),Oi.needsUpdate=!0,M.intersectsTriangle(Oi))return!0;return!1}});for(let d=x*3,M=(m+x)*3;d<M;d+=3){de(Ii,d,f,u),Ii.a.applyMatrix4(_s),Ii.b.applyMatrix4(_s),Ii.c.applyMatrix4(_s),Ii.needsUpdate=!0;for(let v=0,g=p.count;v<g;v+=3)if(de(Oi,v,p,_),Oi.needsUpdate=!0,Ii.intersectsTriangle(Oi))return!0}}else{const h=i+8,f=o[i+6];return ae(h,r,pr),!!(s.intersectsBox(pr)&&ta(h,t,e,n,s)||(ae(f,r,pr),s.intersectsBox(pr)&&ta(f,t,e,n,s)))}}const _r=new Kt,Io=new Ne,gs=new Ne,Gg=new L,kg=new L,Wg=new L,Xg=new L;function Yg(i,t,e,n={},s={},r=0,a=1/0){t.boundingBox||t.computeBoundingBox(),Io.set(t.boundingBox.min,t.boundingBox.max,e),Io.needsUpdate=!0;const o=i.geometry,c=o.attributes.position,l=o.index,h=t.attributes.position,f=t.index,u=$e.getPrimitive(),p=$e.getPrimitive();let _=Gg,x=kg,m=null,d=null;s&&(m=Wg,d=Xg);let M=1/0,v=null,g=null;return _r.copy(e).invert(),gs.matrix.copy(_r),i.shapecast({boundsTraverseOrder:y=>Io.distanceToBox(y),intersectsBounds:(y,A,T)=>T<M&&T<a?(A&&(gs.min.copy(y.min),gs.max.copy(y.max),gs.needsUpdate=!0),!0):!1,intersectsRange:(y,A)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:P=>gs.distanceToBox(P),intersectsBounds:(P,E,S)=>S<M&&S<a,intersectsRange:(P,E)=>{for(let S=P,D=P+E;S<D;S++){de(p,3*S,f,h),p.a.applyMatrix4(e),p.b.applyMatrix4(e),p.c.applyMatrix4(e),p.needsUpdate=!0;for(let I=y,B=y+A;I<B;I++){de(u,3*I,l,c),u.needsUpdate=!0;const R=u.distanceToTriangle(p,_,m);if(R<M&&(x.copy(_),d&&d.copy(m),M=R,v=I,g=S),R<r)return!0}}}});{const T=ns(t);for(let P=0,E=T;P<E;P++){de(p,3*P,f,h),p.a.applyMatrix4(e),p.b.applyMatrix4(e),p.c.applyMatrix4(e),p.needsUpdate=!0;for(let S=y,D=y+A;S<D;S++){de(u,3*S,l,c),u.needsUpdate=!0;const I=u.distanceToTriangle(p,_,m);if(I<M&&(x.copy(_),d&&d.copy(m),M=I,v=S,g=P),I<r)return!0}}}}}),$e.releasePrimitive(u),$e.releasePrimitive(p),M===1/0?null:(n.point?n.point.copy(x):n.point=x.clone(),n.distance=M,n.faceIndex=v,s&&(s.point?s.point.copy(d):s.point=d.clone(),s.point.applyMatrix4(_r),x.applyMatrix4(_r),s.distance=x.sub(s.point).length(),s.faceIndex=g),n)}function qg(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position;let r,a,o,c,l=0;const h=i._roots;for(let u=0,p=h.length;u<p;u++)r=h[u],a=new Uint32Array(r),o=new Uint16Array(r),c=new Float32Array(r),f(0,l),l+=r.byteLength;function f(u,p,_=!1){const x=u*2;if(o[x+15]===Hr){const d=a[u+6],M=o[x+14];let v=1/0,g=1/0,y=1/0,A=-1/0,T=-1/0,P=-1/0;for(let E=d,S=d+M;E<S;E++){const D=3*i.resolveTriangleIndex(E);for(let I=0;I<3;I++){let B=D+I;B=n?n[B]:B;const R=s.getX(B),O=s.getY(B),F=s.getZ(B);R<v&&(v=R),R>A&&(A=R),O<g&&(g=O),O>T&&(T=O),F<y&&(y=F),F>P&&(P=F)}}return c[u+0]!==v||c[u+1]!==g||c[u+2]!==y||c[u+3]!==A||c[u+4]!==T||c[u+5]!==P?(c[u+0]=v,c[u+1]=g,c[u+2]=y,c[u+3]=A,c[u+4]=T,c[u+5]=P,!0):!1}else{const d=u+8,M=a[u+6],v=d+p,g=M+p;let y=_,A=!1,T=!1;t?y||(A=t.has(v),T=t.has(g),y=!A&&!T):(A=!0,T=!0);const P=y||A,E=y||T;let S=!1;P&&(S=f(d,p,y));let D=!1;E&&(D=f(M,p,y));const I=S||D;if(I)for(let B=0;B<3;B++){const R=d+B,O=M+B,F=c[R],Y=c[R+3],q=c[O],Z=c[O+3];c[u+B]=F<q?F:q,c[u+B+3]=Y>Z?Y:Z}return I}}}const xl=new L;function Zg(i,t,e,n,s){se.setBuffer(i._roots[t]),ea(0,i,e,n,s),se.clearBuffer()}function ea(i,t,e,n,s){const{float32Array:r,uint16Array:a,uint32Array:o}=se,c=i*2;if(Ve(c,a)){const h=Ge(i,o),f=je(c,a);Og(t,e,n,h,f,s)}else{const h=Je(i);Xn(h,r,n,xl)&&ea(h,t,e,n,s);const f=Qe(i,o);Xn(f,r,n,xl)&&ea(f,t,e,n,s)}}const vl=new L,Kg=["x","y","z"];function $g(i,t,e,n){se.setBuffer(i._roots[t]);const s=na(0,i,e,n);return se.clearBuffer(),s}function na(i,t,e,n){const{float32Array:s,uint16Array:r,uint32Array:a}=se;let o=i*2;if(Ve(o,r)){const l=Ge(i,a),h=je(o,r);return Ng(t,e,n,l,h)}else{const l=dh(i,a),h=Kg[l],u=n.direction[h]>=0;let p,_;u?(p=Je(i),_=Qe(i,a)):(p=Qe(i,a),_=Je(i));const m=Xn(p,s,n,vl)?na(p,t,e,n):null;if(m){const v=m.point[h];if(u?v<=s[_+l]:v>=s[_+l+3])return m}const M=Xn(_,s,n,vl)?na(_,t,e,n):null;return m&&M?m.distance<=M.distance?m:M:m||M||null}}const gr=new ye,Ni=new hn,Fi=new hn,xs=new Kt,El=new Ne,xr=new Ne;function jg(i,t,e,n){se.setBuffer(i._roots[t]);const s=ia(0,i,e,n);return se.clearBuffer(),s}function ia(i,t,e,n,s=null){const{float32Array:r,uint16Array:a,uint32Array:o}=se;let c=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),El.set(e.boundingBox.min,e.boundingBox.max,n),s=El),Ve(c,a)){const h=t.geometry,f=h.index,u=h.attributes.position,p=e.index,_=e.attributes.position,x=Ge(i,o),m=je(c,a);if(xs.copy(n).invert(),e.boundsTree)return ae(i,r,xr),xr.matrix.copy(xs),xr.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:M=>xr.intersectsBox(M),intersectsTriangle:M=>{M.a.applyMatrix4(n),M.b.applyMatrix4(n),M.c.applyMatrix4(n),M.needsUpdate=!0;for(let v=x,g=m+x;v<g;v++)if(de(Fi,3*t.resolveTriangleIndex(v),f,u),Fi.needsUpdate=!0,M.intersectsTriangle(Fi))return!0;return!1}});for(let d=x,M=m+x;d<M;d++){const v=t.resolveTriangleIndex(d);de(Ni,3*v,f,u),Ni.a.applyMatrix4(xs),Ni.b.applyMatrix4(xs),Ni.c.applyMatrix4(xs),Ni.needsUpdate=!0;for(let g=0,y=p.count;g<y;g+=3)if(de(Fi,g,p,_),Fi.needsUpdate=!0,Ni.intersectsTriangle(Fi))return!0}}else{const h=i+8,f=o[i+6];return ae(h,r,gr),!!(s.intersectsBox(gr)&&ia(h,t,e,n,s)||(ae(f,r,gr),s.intersectsBox(gr)&&ia(f,t,e,n,s)))}}const vr=new Kt,Oo=new Ne,vs=new Ne,Jg=new L,Qg=new L,tx=new L,ex=new L;function nx(i,t,e,n={},s={},r=0,a=1/0){t.boundingBox||t.computeBoundingBox(),Oo.set(t.boundingBox.min,t.boundingBox.max,e),Oo.needsUpdate=!0;const o=i.geometry,c=o.attributes.position,l=o.index,h=t.attributes.position,f=t.index,u=$e.getPrimitive(),p=$e.getPrimitive();let _=Jg,x=Qg,m=null,d=null;s&&(m=tx,d=ex);let M=1/0,v=null,g=null;return vr.copy(e).invert(),vs.matrix.copy(vr),i.shapecast({boundsTraverseOrder:y=>Oo.distanceToBox(y),intersectsBounds:(y,A,T)=>T<M&&T<a?(A&&(vs.min.copy(y.min),vs.max.copy(y.max),vs.needsUpdate=!0),!0):!1,intersectsRange:(y,A)=>{if(t.boundsTree){const T=t.boundsTree;return T.shapecast({boundsTraverseOrder:P=>vs.distanceToBox(P),intersectsBounds:(P,E,S)=>S<M&&S<a,intersectsRange:(P,E)=>{for(let S=P,D=P+E;S<D;S++){const I=T.resolveTriangleIndex(S);de(p,3*I,f,h),p.a.applyMatrix4(e),p.b.applyMatrix4(e),p.c.applyMatrix4(e),p.needsUpdate=!0;for(let B=y,R=y+A;B<R;B++){const O=i.resolveTriangleIndex(B);de(u,3*O,l,c),u.needsUpdate=!0;const F=u.distanceToTriangle(p,_,m);if(F<M&&(x.copy(_),d&&d.copy(m),M=F,v=B,g=S),F<r)return!0}}}})}else{const T=ns(t);for(let P=0,E=T;P<E;P++){de(p,3*P,f,h),p.a.applyMatrix4(e),p.b.applyMatrix4(e),p.c.applyMatrix4(e),p.needsUpdate=!0;for(let S=y,D=y+A;S<D;S++){const I=i.resolveTriangleIndex(S);de(u,3*I,l,c),u.needsUpdate=!0;const B=u.distanceToTriangle(p,_,m);if(B<M&&(x.copy(_),d&&d.copy(m),M=B,v=S,g=P),B<r)return!0}}}}}),$e.releasePrimitive(u),$e.releasePrimitive(p),M===1/0?null:(n.point?n.point.copy(x):n.point=x.clone(),n.distance=M,n.faceIndex=v,s&&(s.point?s.point.copy(d):s.point=d.clone(),s.point.applyMatrix4(vr),x.applyMatrix4(vr),s.distance=x.sub(s.point).length(),s.faceIndex=g),n)}function ix(){return typeof SharedArrayBuffer<"u"}const ys=new se.constructor,Lr=new se.constructor,Bn=new va(()=>new ye),Bi=new ye,zi=new ye,No=new ye,Fo=new ye;let Bo=!1;function sx(i,t,e,n){if(Bo)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");Bo=!0;const s=i._roots,r=t._roots;let a,o=0,c=0;const l=new Kt().copy(e).invert();for(let h=0,f=s.length;h<f;h++){ys.setBuffer(s[h]),c=0;const u=Bn.getPrimitive();ae(0,ys.float32Array,u),u.applyMatrix4(l);for(let p=0,_=r.length;p<_&&(Lr.setBuffer(r[h]),a=on(0,0,e,l,n,o,c,0,0,u),Lr.clearBuffer(),c+=r[p].length,!a);p++);if(Bn.releasePrimitive(u),ys.clearBuffer(),o+=s[h].length,a)break}return Bo=!1,a}function on(i,t,e,n,s,r=0,a=0,o=0,c=0,l=null,h=!1){let f,u;h?(f=Lr,u=ys):(f=ys,u=Lr);const p=f.float32Array,_=f.uint32Array,x=f.uint16Array,m=u.float32Array,d=u.uint32Array,M=u.uint16Array,v=i*2,g=t*2,y=Ve(v,x),A=Ve(g,M);let T=!1;if(A&&y)h?T=s(Ge(t,d),je(t*2,M),Ge(i,_),je(i*2,x),c,a+t,o,r+i):T=s(Ge(i,_),je(i*2,x),Ge(t,d),je(t*2,M),o,r+i,c,a+t);else if(A){const P=Bn.getPrimitive();ae(t,m,P),P.applyMatrix4(e);const E=Je(i),S=Qe(i,_);ae(E,p,Bi),ae(S,p,zi);const D=P.intersectsBox(Bi),I=P.intersectsBox(zi);T=D&&on(t,E,n,e,s,a,r,c,o+1,P,!h)||I&&on(t,S,n,e,s,a,r,c,o+1,P,!h),Bn.releasePrimitive(P)}else{const P=Je(t),E=Qe(t,d);ae(P,m,No),ae(E,m,Fo);const S=l.intersectsBox(No),D=l.intersectsBox(Fo);if(S&&D)T=on(i,P,e,n,s,r,a,o,c+1,l,h)||on(i,E,e,n,s,r,a,o,c+1,l,h);else if(S)if(y)T=on(i,P,e,n,s,r,a,o,c+1,l,h);else{const I=Bn.getPrimitive();I.copy(No).applyMatrix4(e);const B=Je(i),R=Qe(i,_);ae(B,p,Bi),ae(R,p,zi);const O=I.intersectsBox(Bi),F=I.intersectsBox(zi);T=O&&on(P,B,n,e,s,a,r,c,o+1,I,!h)||F&&on(P,R,n,e,s,a,r,c,o+1,I,!h),Bn.releasePrimitive(I)}else if(D)if(y)T=on(i,E,e,n,s,r,a,o,c+1,l,h);else{const I=Bn.getPrimitive();I.copy(Fo).applyMatrix4(e);const B=Je(i),R=Qe(i,_);ae(B,p,Bi),ae(R,p,zi);const O=I.intersectsBox(Bi),F=I.intersectsBox(zi);T=O&&on(E,B,n,e,s,a,r,c,o+1,I,!h)||F&&on(E,R,n,e,s,a,r,c,o+1,I,!h),Bn.releasePrimitive(I)}}return T}const Er=new Ne,Ml=new ye;class Ea{static serialize(t,e={}){e={cloneBuffers:!0,...e};const n=t.geometry,s=t._roots,r=t._indirectBuffer,a=n.getIndex();let o;return e.cloneBuffers?o={roots:s.map(c=>c.slice()),index:a.array.slice(),indirectBuffer:r?r.slice():null}:o={roots:s,index:a.array,indirectBuffer:r},o}static deserialize(t,e,n={}){n={setIndex:!0,indirect:!!t.indirectBuffer,...n};const{index:s,roots:r,indirectBuffer:a}=t,o=new Ea(e,{...n,[Po]:!0});if(o._roots=r,o._indirectBuffer=a||null,n.setIndex){const c=e.getIndex();if(c===null){const l=new tn(t.index,1,!1);e.setIndex(l)}else c.array!==s&&(c.array.set(s),c.needsUpdate=!0)}return o}get indirect(){return!!this._indirectBuffer}constructor(t,e={}){if(t.isBufferGeometry){if(t.index&&t.index.isInterleavedBufferAttribute)throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("MeshBVH: Only BufferGeometries are supported.");if(e=Object.assign({strategy:hh,maxDepth:40,maxLeafTris:10,verbose:!0,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,[Po]:!1},e),e.useSharedArrayBuffer&&!ix())throw new Error("MeshBVH: SharedArrayBuffer is not available.");this.geometry=t,this._roots=null,this._indirectBuffer=null,e[Po]||(Mg(this,e),!t.boundingBox&&e.setBoundingBox&&(t.boundingBox=this.getBoundingBox(new ye)));const{_indirectBuffer:n}=this;this.resolveTriangleIndex=e.indirect?s=>n[s]:s=>s}refit(t=null){return(this.indirect?qg:Ig)(this,t)}traverse(t,e=0){const n=this._roots[e],s=new Uint32Array(n),r=new Uint16Array(n);a(0);function a(o,c=0){const l=o*2,h=r[l+15]===Hr;if(h){const f=s[o+6],u=r[l+14];t(c,h,new Float32Array(n,o*4,6),f,u)}else{const f=o+Sr/4,u=s[o+6],p=s[o+7];t(c,h,new Float32Array(n,o*4,6),p)||(a(f,c+1),a(u,c+1))}}}raycast(t,e=_n){const n=this._roots,s=this.geometry,r=[],a=e.isMaterial,o=Array.isArray(e),c=s.groups,l=a?e.side:e,h=this.indirect?Zg:Bg;for(let f=0,u=n.length;f<u;f++){const p=o?e[c[f].materialIndex].side:l,_=r.length;if(h(this,f,p,t,r),o){const x=c[f].materialIndex;for(let m=_,d=r.length;m<d;m++)r[m].face.materialIndex=x}}return r}raycastFirst(t,e=_n){const n=this._roots,s=this.geometry,r=e.isMaterial,a=Array.isArray(e);let o=null;const c=s.groups,l=r?e.side:e,h=this.indirect?$g:Hg;for(let f=0,u=n.length;f<u;f++){const p=a?e[c[f].materialIndex].side:l,_=h(this,f,p,t);_!=null&&(o==null||_.distance<o.distance)&&(o=_,a&&(_.face.materialIndex=c[f].materialIndex))}return o}intersectsGeometry(t,e){let n=!1;const s=this._roots,r=this.indirect?jg:Vg;for(let a=0,o=s.length;a<o&&(n=r(this,a,t,e),!n);a++);return n}shapecast(t){const e=$e.getPrimitive(),n=this.indirect?Fg:Dg;let{boundsTraverseOrder:s,intersectsBounds:r,intersectsRange:a,intersectsTriangle:o}=t;if(a&&o){const f=a;a=(u,p,_,x,m)=>f(u,p,_,x,m)?!0:n(u,p,this,o,_,x,e)}else a||(o?a=(f,u,p,_)=>n(f,u,this,o,p,_,e):a=(f,u,p)=>p);let c=!1,l=0;const h=this._roots;for(let f=0,u=h.length;f<u;f++){const p=h[f];if(c=wg(this,f,r,a,s,l),c)break;l+=p.byteLength}return $e.releasePrimitive(e),c}bvhcast(t,e,n){let{intersectsRanges:s,intersectsTriangles:r}=n;const a=$e.getPrimitive(),o=this.geometry.index,c=this.geometry.attributes.position,l=this.indirect?_=>{const x=this.resolveTriangleIndex(_);de(a,x*3,o,c)}:_=>{de(a,_*3,o,c)},h=$e.getPrimitive(),f=t.geometry.index,u=t.geometry.attributes.position,p=t.indirect?_=>{const x=t.resolveTriangleIndex(_);de(h,x*3,f,u)}:_=>{de(h,_*3,f,u)};if(r){const _=(x,m,d,M,v,g,y,A)=>{for(let T=d,P=d+M;T<P;T++){p(T),h.a.applyMatrix4(e),h.b.applyMatrix4(e),h.c.applyMatrix4(e),h.needsUpdate=!0;for(let E=x,S=x+m;E<S;E++)if(l(E),a.needsUpdate=!0,r(a,h,E,T,v,g,y,A))return!0}return!1};if(s){const x=s;s=function(m,d,M,v,g,y,A,T){return x(m,d,M,v,g,y,A,T)?!0:_(m,d,M,v,g,y,A,T)}}else s=_}return sx(this,t,e,s)}intersectsBox(t,e){return Er.set(t.min,t.max,e),Er.needsUpdate=!0,this.shapecast({intersectsBounds:n=>Er.intersectsBox(n),intersectsTriangle:n=>Er.intersectsTriangle(n)})}intersectsSphere(t){return this.shapecast({intersectsBounds:e=>t.intersectsBox(e),intersectsTriangle:e=>e.intersectsSphere(t)})}closestPointToGeometry(t,e,n={},s={},r=0,a=1/0){return(this.indirect?nx:Yg)(this,t,e,n,s,r,a)}closestPointToPoint(t,e={},n=0,s=1/0){return Cg(this,t,e,n,s)}getBoundingBox(t){return t.makeEmpty(),this._roots.forEach(n=>{ae(0,new Float32Array(n),Ml),t.union(Ml)}),t}}function Sl(i,t,e){return i===null||(i.point.applyMatrix4(t.matrixWorld),i.distance=i.point.distanceTo(e.ray.origin),i.object=t,i.distance<e.near||i.distance>e.far)?null:i}const zo=new ha,yl=new Kt,rx=ln.prototype.raycast;function ox(i,t){if(this.geometry.boundsTree){if(this.material===void 0)return;yl.copy(this.matrixWorld).invert(),zo.copy(i.ray).applyMatrix4(yl);const e=this.geometry.boundsTree;if(i.firstHitOnly===!0){const n=Sl(e.raycastFirst(zo,this.material),this,i);n&&t.push(n)}else{const n=e.raycast(zo,this.material);for(let s=0,r=n.length;s<r;s++){const a=Sl(n[s],this,i);a&&t.push(a)}}}else rx.call(this,i,t)}function ax(i){return this.boundsTree=new Ea(this,i),this.boundsTree}function cx(){this.boundsTree=null}const ue=class ue{static create(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return`${ue._lut[t&255]+ue._lut[t>>8&255]+ue._lut[t>>16&255]+ue._lut[t>>24&255]}-${ue._lut[e&255]}${ue._lut[e>>8&255]}-${ue._lut[e>>16&15|64]}${ue._lut[e>>24&255]}-${ue._lut[n&63|128]}${ue._lut[n>>8&255]}-${ue._lut[n>>16&255]}${ue._lut[n>>24&255]}${ue._lut[s&255]}${ue._lut[s>>8&255]}${ue._lut[s>>16&255]}${ue._lut[s>>24&255]}`.toLowerCase()}static validate(t){if(!ue._pattern.test(t))throw new Error(`${t} is not a valid UUID v4.

- If you're the tool creator, you can take one from https://www.uuidgenerator.net/.

- If you're using a platform tool, verify the uuid isn't misspelled or contact the tool creator.`)}};ht(ue,"_pattern",/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/),ht(ue,"_lut",["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"]);let Ur=ue;const Dr=class Dr{constructor(){ht(this,"meshes",new Set);ht(this,"onDisposed",new Ee);ht(this,"list",new Map);ht(this,"enabled",!1);ht(this,"_clock");ht(this,"update",async()=>{if(!this.enabled)return;const t=this._clock.getDelta();for(const[e,n]of this.list)n.enabled&&n.isUpdateable()&&await n.update(t);requestAnimationFrame(this.update)});this._clock=new Z_,Dr.setupBVH()}add(t,e){if(this.list.has(t))throw new Error("You're trying to add a component that already exists in the components intance. Use Components.get() instead.");Ur.validate(t),this.list.set(t,e)}get(t){const e=t.uuid;if(!this.list.has(e)){const n=new t(this);return this.list.has(e)||this.add(e,n),n}return this.list.get(e)}async init(){this.enabled=!0,this._clock.start(),await this.update()}dispose(){const t=this.get(Pr);this.enabled=!1;for(const[e,n]of this.list)n.enabled=!1,n.isDisposeable()&&n.dispose();this._clock.stop();for(const e of this.meshes)t.destroy(e);this.meshes.clear(),this.onDisposed.trigger(),this.onDisposed.reset()}static setupBVH(){Rn.prototype.computeBoundsTree=ax,Rn.prototype.disposeBoundsTree=cx,ln.prototype.raycast=ox}};ht(Dr,"release","1.4.21");let sa=Dr;const Hi=new L,Tl=new Kt,Al=new Kt,bl=new L,wl=new L;class lx{constructor(t={}){const e=this;let n,s,r,a;const o={objects:new WeakMap},c=t.element!==void 0?t.element:document.createElement("div");c.style.overflow="hidden",this.domElement=c,this.getSize=function(){return{width:n,height:s}},this.render=function(p,_){p.matrixWorldAutoUpdate===!0&&p.updateMatrixWorld(),_.parent===null&&_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),Tl.copy(_.matrixWorldInverse),Al.multiplyMatrices(_.projectionMatrix,Tl),l(p,p,_),u(p)},this.setSize=function(p,_){n=p,s=_,r=n/2,a=s/2,c.style.width=p+"px",c.style.height=_+"px"};function l(p,_,x){if(p.isCSS2DObject){Hi.setFromMatrixPosition(p.matrixWorld),Hi.applyMatrix4(Al);const m=p.visible===!0&&Hi.z>=-1&&Hi.z<=1&&p.layers.test(x.layers)===!0;if(p.element.style.display=m===!0?"":"none",m===!0){p.onBeforeRender(e,_,x);const M=p.element;M.style.transform="translate("+-100*p.center.x+"%,"+-100*p.center.y+"%)translate("+(Hi.x*r+r)+"px,"+(-Hi.y*a+a)+"px)",M.parentNode!==c&&c.appendChild(M),p.onAfterRender(e,_,x)}const d={distanceToCameraSquared:h(x,p)};o.objects.set(p,d)}for(let m=0,d=p.children.length;m<d;m++)l(p.children[m],_,x)}function h(p,_){return bl.setFromMatrixPosition(p.matrixWorld),wl.setFromMatrixPosition(_.matrixWorld),bl.distanceToSquared(wl)}function f(p){const _=[];return p.traverse(function(x){x.isCSS2DObject&&_.push(x)}),_}function u(p){const _=f(p).sort(function(m,d){if(m.renderOrder!==d.renderOrder)return d.renderOrder-m.renderOrder;const M=o.objects.get(m).distanceToCameraSquared,v=o.objects.get(d).distanceToCameraSquared;return M-v}),x=_.length;for(let m=0,d=_.length;m<d;m++)_[m].element.style.zIndex=x-m}}}class hx extends ng{constructor(e,n,s){super(e);ht(this,"enabled",!0);ht(this,"container");ht(this,"three");ht(this,"_renderer2D",new lx);ht(this,"_canvas");ht(this,"_parameters");ht(this,"resize",e=>{if(this.updateContainer(),!this.container)return;const n=e?e.x:this.container.clientWidth,s=e?e.y:this.container.clientHeight;this.three.setSize(n,s),this._renderer2D.setSize(n,s),this.onResize.trigger(e)});ht(this,"resizeEvent",()=>{this.resize()});ht(this,"onContextLost",e=>{e.preventDefault(),this.components.enabled=!1});ht(this,"onContextBack",()=>{this.three.setRenderTarget(null),this.three.dispose(),this.three=new Ko({canvas:this._canvas,antialias:!0,alpha:!0,...this._parameters}),this.components.enabled=!0});this.container=n||null,this._parameters=s,this.three=new Ko({antialias:!0,alpha:!0,...s}),this.three.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.setupRenderers(),this.setupEvents(!0),this.resize(),this._canvas=this.three.domElement;const r=this.three.getContext(),{canvas:a}=r;a.addEventListener("webglcontextlost",this.onContextLost,!1),a.addEventListener("webglcontextrestored",this.onContextBack,!1)}get(){return this.three}update(){if(!this.enabled||!this.world)return;this.onBeforeUpdate.trigger(this);const e=this.world.scene.three,n=this.world.camera.three;this.three.render(e,n),e instanceof rh&&this._renderer2D.render(e,n),this.onAfterUpdate.trigger(this)}dispose(){this.enabled=!1,this.setupEvents(!1),this.three.domElement.remove(),this.three.dispose(),this._renderer2D.domElement.remove(),this.onResize.reset(),this.onAfterUpdate.reset(),this.onBeforeUpdate.reset(),this.onDisposed.trigger(),this.onDisposed.reset()}getSize(){return new kt(this.three.domElement.clientWidth,this.three.domElement.clientHeight)}setupEvents(e){e?window.addEventListener("resize",this.resizeEvent):window.removeEventListener("resize",this.resizeEvent)}setupRenderers(){this.three.localClippingEnabled=!0,this._renderer2D.domElement.style.position="absolute",this._renderer2D.domElement.style.top="0px",this._renderer2D.domElement.style.pointerEvents="none",this.container&&(this.container.appendChild(this.three.domElement),this.container.appendChild(this._renderer2D.domElement)),this.updateContainer()}updateContainer(){if(!this.container){const e=this.three.domElement.parentElement;e&&(this.container=e,e.appendChild(this._renderer2D.domElement))}}}class ux extends ig{constructor(e){super(e);ht(this,"isSetup",!1);ht(this,"three");ht(this,"onSetup",new Ee);ht(this,"config",{directionalLight:{color:new qt("white"),intensity:1.5,position:new L(5,10,3)},ambientLight:{color:new qt("white"),intensity:1}});this.three=new rh,this.three.background=new qt(2107698)}setup(e){this.config={...this.config,...e};const n=new Y_(this.config.directionalLight.color,this.config.directionalLight.intensity);n.position.copy(this.config.directionalLight.position);const s=new q_(this.config.ambientLight.color,this.config.ambientLight.intensity);this.three.add(n,s),this.isSetup=!0,this.onSetup.trigger(this)}}class fx extends ma{constructor(e){super(e);ht(this,"onAfterUpdate",new Ee);ht(this,"onBeforeUpdate",new Ee);ht(this,"enabled",!1);ht(this,"uuid",Ur.create());ht(this,"onDisposed",new Ee);ht(this,"_scene");ht(this,"_camera");ht(this,"_renderer",null)}get scene(){if(!this._scene)throw new Error("No scene initialized!");return this._scene}set scene(e){this._scene&&(this._scene.world=null),this._scene=e,e.world=this}get camera(){if(!this._camera)throw new Error("No camera initialized!");return this._camera}set camera(e){this._camera&&(this._camera.world=null),this._camera=e,e.world=this}get renderer(){return this._renderer}set renderer(e){this._renderer&&(this._renderer.world=null),this._renderer=e,e&&(e.world=this)}update(e){this.enabled&&(this.onBeforeUpdate.trigger(),this.camera.isUpdateable()&&this.camera.update(e),this.renderer&&this.renderer.update(e),this.onAfterUpdate.trigger())}dispose(){this.enabled=!1,this.scene.dispose(),this.camera.isDisposeable()&&this.camera.dispose(),this.renderer&&this.renderer.dispose()}}const Ir=class Ir extends lh{constructor(e){super(e);ht(this,"onAfterUpdate",new Ee);ht(this,"onBeforeUpdate",new Ee);ht(this,"onDisposed",new Ee);ht(this,"list",new Map);ht(this,"enabled",!0);e.add(Ir.uuid,this)}dispose(){this.enabled=!1;for(const[e,n]of this.list)n.dispose();this.onDisposed.trigger()}update(e){if(this.enabled)for(const[n,s]of this.list)s.update(e)}};ht(Ir,"uuid","fdb61dc4-2ec1-4966-b83d-54ea795fad4a");let ra=Ir;const dx=document.getElementById("container"),is=new sa,px=is.get(ra),li=new fx(is);px.list.set(li.uuid,li);li.scene=new ux(is);li.renderer=new hx(is,dx);li.camera=new ga(is);li.enabled=!0;is.init();const mx=new ln(new ts);li.scene.three.add(mx);
